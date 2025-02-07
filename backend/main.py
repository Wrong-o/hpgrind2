from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from quiz_generator import generate_math_question, QuizQuestion
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List
from models.database_models import Base, DBUser, UserAchievement, QuestionAttempt
from database import get_db, engine
from services.user_service import create_user, authenticate_user
from models.pydantic_models import User, UserCreate, Token
from services.stats_service import UserStats
from services.recommendation_service import RecommendationEngine
import auth
from seed_data import seed_database  # Add this import
from pydantic import BaseModel

# Create tables and seed data
Base.metadata.create_all(bind=engine)
seed_database()  # Add this line

app = FastAPI()

# Move CORS middleware to the top, before any routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Add custom exception handler to maintain CORS headers on errors
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": str(exc)},
        headers={
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Credentials": "true",
        },
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers={
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Credentials": "true",
        },
    )

@app.options("/api/question")
async def options_question():
    return {"message": "OK"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/goals")
async def get_goals():
    # Placeholder for database integration
    return {"goals": []}

@app.get("/api/question")
async def get_question():
    try:
        return generate_math_question()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        print(f"Attempting to register user with email: {user.email}")  # Debug log
        db_user = create_user(db, user)
        return JSONResponse(
            content={"id": db_user.id, "email": db_user.email},
            headers={
                "Access-Control-Allow-Origin": "http://localhost:5173",
                "Access-Control-Allow-Credentials": "true",
            },
        )
    except Exception as e:
        print(f"Registration error: {str(e)}")  # Debug log
        print(f"Error type: {type(e)}")  # Debug log
        import traceback
        print(f"Traceback: {traceback.format_exc()}")  # Full traceback
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.post("/api/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        user = authenticate_user(db, form_data.username, form_data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password"
            )
        access_token = auth.create_access_token(data={"sub": user.email})
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        print(f"Login error: {str(e)}")  # Add logging
        raise

# Protected route example
@app.get("/api/me", response_model=User)
async def read_users_me(current_user: User = Depends(auth.get_current_user)):
    return current_user

@app.get("/api/user/stats")
async def get_user_stats(current_user: User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    stats = UserStats(db, current_user.id)
    return stats.get_overall_stats()

@app.get("/api/user/recommendations")
async def get_recommendations(current_user: User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    engine = RecommendationEngine(db, current_user.id)
    return {
        "next_category": engine.get_next_recommended_category(),
        "recommended_questions": engine.get_recommended_questions()
    }

@app.get("/api/user/achievements")
async def get_achievements(current_user: User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    achievements = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id
    ).all()
    return achievements

@app.get("/api/user/category-stats")
async def get_category_stats(
    current_user: User = Depends(auth.get_current_user), 
    db: Session = Depends(get_db)
):
    stats = UserStats(db, current_user.id)
    return stats.get_category_stats()

@app.get("/api/xyz/stats")
async def get_xyz_stats(current_user: User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    attempts = db.query(QuestionAttempt).filter(
        QuestionAttempt.user_id == current_user.id,
        QuestionAttempt.subcategory.like('XYZ%')  # Only XYZ questions
    ).all()

    stats_by_subcategory = {}
    
    for attempt in attempts:
        if attempt.subcategory not in stats_by_subcategory:
            stats_by_subcategory[attempt.subcategory] = {
                'correct': 0,
                'total_time': 0,
                'total_questions': 0
            }
        
        stats = stats_by_subcategory[attempt.subcategory]
        stats['total_questions'] += 1
        stats['total_time'] += attempt.time_taken
        if attempt.is_correct:
            stats['correct'] += 1

    return [
        {
            'subcategory': subcat,
            'correct_percentage': round((stats['correct'] / stats['total_questions']) * 100, 1),
            'average_time': round(stats['total_time'] / stats['total_questions'], 1),
            'total_questions': stats['total_questions']
        }
        for subcat, stats in stats_by_subcategory.items()
    ]

# Add this class for request validation
class AttemptCreate(BaseModel):
    question_id: int
    subcategory: str
    is_correct: bool
    is_skipped: bool
    time_taken: int

@app.post("/api/attempts")
async def save_attempt(
    attempt: AttemptCreate,  # Change from dict to AttemptCreate
    current_user: User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    try:
        new_attempt = QuestionAttempt(
            user_id=current_user.id,
            question_id=attempt.question_id,  # Use dot notation instead of dict access
            subcategory=attempt.subcategory,
            is_correct=attempt.is_correct,
            is_skipped=attempt.is_skipped,
            time_taken=attempt.time_taken
        )
        db.add(new_attempt)
        db.commit()
        return {"status": "success"}
    except Exception as e:
        db.rollback()
        print(f"Error saving attempt: {str(e)}")  # Add debug logging
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save attempt: {str(e)}"
        )