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
from sqlalchemy import inspect

def create_tables_if_not_exist():
    """Create tables only if they don't exist"""
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()
    
    if not existing_tables:
        print("No tables found. Creating database schema...")
        Base.metadata.create_all(bind=engine)
        print("Database schema created")
        # Seed database with initial data
        seed_database()
    else:
        print(f"Found existing tables: {existing_tables}")

# Call this instead of the drop/create
create_tables_if_not_exist()

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
    """
    Health check endpoint to verify API is running.
    Returns:
        dict: {"status": "healthy"}
    """
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
    """
    Login endpoint to authenticate user and get token.
    
    Args:
        form_data (OAuth2PasswordRequestForm): Contains:
            - username (str): User's email
            - password (str): User's password
        db (Session): Database session
    
    Returns:
        dict: Token information containing:
            - access_token (str): JWT token
            - token_type (str): Always "bearer"
    
    Raises:
        HTTPException: 401 if credentials invalid
    """
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

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
    """
    Get XYZ question statistics for the current user.
    
    Args:
        current_user (User): Authenticated user from token
        db (Session): Database session
    
    Returns:
        list: List of stats for each subcategory containing:
            - subcategory (str): Name of subcategory
            - correct_percentage (float): Percentage of correct answers
            - average_time (float): Average time per question
            - total_questions (int): Total questions attempted
    """
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

@app.options("/api/attempts")
async def options_attempts():
    return {"message": "OK"}

@app.post("/api/attempts")
async def save_attempt(
    attempt: AttemptCreate,
    current_user: User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Save a question attempt for a user.
    """
    try:
        print("\n=== Attempt Save Debug ===")
        print("1. Request Data:")
        print(f"  - Attempt data: {attempt.dict()}")
        print(f"  - Current user ID: {current_user.id}")
        print(f"  - Current user email: {current_user.email}")
        
        print("\n2. Database Session Check:")
        print(f"  - Session is active: {db.is_active}")
        
        print("\n3. Creating QuestionAttempt:")
        new_attempt = QuestionAttempt(
            user_id=current_user.id,
            question_id=attempt.question_id,
            subcategory=attempt.subcategory,
            is_correct=attempt.is_correct,
            is_skipped=attempt.is_skipped,
            time_taken=attempt.time_taken
        )
        
        print("  - New attempt object created:")
        print(f"    * user_id: {new_attempt.user_id}")
        print(f"    * question_id: {new_attempt.question_id}")
        print(f"    * subcategory: {new_attempt.subcategory}")
        print(f"    * is_correct: {new_attempt.is_correct}")
        print(f"    * is_skipped: {new_attempt.is_skipped}")
        print(f"    * time_taken: {new_attempt.time_taken}")
        
        print("\n4. Adding to Database:")
        try:
            print("  - Adding to session...")
            db.add(new_attempt)
            print("  - Added successfully")
            
            print("  - Session state after add:")
            print(f"    * Object in session: {new_attempt in db}")
            print(f"    * Session has changes: {db.dirty or db.new}")
            
            print("  - Committing transaction...")
            db.commit()
            print("  - Committed successfully")
            
            print("\n5. Verifying Save:")
            saved_attempt = db.query(QuestionAttempt).filter(
                QuestionAttempt.id == new_attempt.id
            ).first()
            print(f"  - Found in database: {saved_attempt is not None}")
            if saved_attempt:
                print("  - Saved data:")
                print(f"    * ID: {saved_attempt.id}")
                print(f"    * User ID: {saved_attempt.user_id}")
                print(f"    * Question ID: {saved_attempt.question_id}")
                print(f"    * Subcategory: {saved_attempt.subcategory}")
                print(f"    * Is Correct: {saved_attempt.is_correct}")
                print(f"    * Is Skipped: {saved_attempt.is_skipped}")
                print(f"    * Time Taken: {saved_attempt.time_taken}")
            
        except Exception as commit_error:
            print("\n!!! Database Error !!!")
            print(f"  - Error type: {type(commit_error)}")
            print(f"  - Error message: {str(commit_error)}")
            print(f"  - Session state: {db.is_active}")
            print("  - Rolling back transaction...")
            db.rollback()
            print("  - Rollback complete")
            raise
            
        print("\n=== Save Completed Successfully ===")
        return {"status": "success"}
        
    except Exception as e:
        print("\n!!! General Error !!!")
        print(f"  - Error type: {type(e)}")
        print(f"  - Error message: {str(e)}")
        print("  - Full error details:")
        import traceback
        print(traceback.format_exc())
        print("\n  - Request data:")
        print(f"    * Attempt: {attempt.dict() if attempt else 'None'}")
        print(f"    * User: {vars(current_user) if current_user else 'None'}")
        print(f"    * DB Session active: {db.is_active if db else 'None'}")
        
        if db and db.is_active:
            print("  - Rolling back transaction...")
            db.rollback()
            print("  - Rollback complete")
            
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save attempt: {str(e)}"
        )

# Add auth debugging endpoint
@app.get("/api/auth/debug")
async def debug_auth(current_user: User = Depends(auth.get_current_user)):
    """
    Debug endpoint to verify authentication and token validity.
    
    Args:
        current_user (User): Authenticated user from token
    
    Returns:
        dict: User information containing:
            - user_id (int): User's ID
            - email (str): User's email
            - is_authenticated (bool): Always true if endpoint reached
    """
    return {
        "user_id": current_user.id,
        "email": current_user.email,
        "is_authenticated": True
    }

@app.post("/api/auth/refresh")
async def refresh_token(current_user: User = Depends(auth.get_current_user)):
    """
    Refresh the user's authentication token.
    
    Args:
        current_user (User): Authenticated user from current token
    
    Returns:
        dict: New token information containing:
            - access_token (str): New JWT token
            - token_type (str): Always "bearer"
    """
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": current_user.email},  # Changed from username to email
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}