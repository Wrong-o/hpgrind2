from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from quiz_generator import generate_math_question, QuizQuestion
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List
from models.database_models import Base, DBUser, UserHistory, Achievement, UserAchievement
from database import get_db, engine
from services.user_service import create_user, authenticate_user, save_user_history
from models.pydantic_models import User, UserCreate, Token
from services.stats_service import UserStats
from services.recommendation_service import RecommendationEngine
from question_generators import xyz_generator, nog_generator, pro_generator, dtk_generator, matematikbasic_generator
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
    allow_origins=["http://localhost:5173"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
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
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
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
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        },
    )

# Add OPTIONS handlers for all routes that need CORS
@app.options("/{path:path}")
async def options_handler(path: str):
    return JSONResponse(
        content={"message": "OK"},
        headers={
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        },
    )

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
async def get_question(type: str = 'XYZ'):
    """
    Get a question based on the test type.
    
    Args:
        type (str): The type of test (XYZ, NOG, PRO, DTK, or MATEMATIKBASIC)
        
    Returns:
        QuizQuestion: A question of the specified type
    """
    try:
        if type == 'XYZ':
            delmoment = ["Rotekvationer", "Olikheter"]
            return xyz_generator.generate_xyz_question(delmoment)
        elif type == 'NOG':
            delmoment = ["Grafer", "Tabeller"]
            return nog_generator.generate_nog_question(delmoment)
        elif type == 'PRO':
            delmoment = ["Problemlösning", "Logik"]
            return pro_generator.generate_pro_question(delmoment)
        elif type == 'DTK':
            delmoment = ["Diagram", "Kartor"]
            return dtk_generator.generate_dtk_question(delmoment)
        elif type == 'MATEMATIKBASIC':
            delmoment = [
                "matematikbasic-räknelagar",
                "matematikbasic-fraktioner-förlänga",
                "matematikbasic-fraktioner-förkorta",
                "matematikbasic-fraktioner-adda",
                "matematikbasic-fraktioner-multiplicera",
                "matematikbasic-ekvationslösning-division",
                "matematikbasic-ekvationslösning-multiplikation",
                "matematikbasic-ekvationslösning-addition",
                "matematikbasic-ekvationslösning-subtraktion"
            ]
            return matematikbasic_generator.generate_matematikbasic_question(delmoment)
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid test type: {type}. Must be one of: XYZ, NOG, PRO, DTK, MATEMATIKBASIC"
            )
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
async def get_user_achievements(
    current_user: User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's achievements"""
    achievements = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id,
        UserAchievement.achieved == True
    ).all()
    return achievements

@app.get("/api/user/history")
async def get_user_history(
    current_user: User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's question attempt history"""
    history = db.query(UserHistory).filter(
        UserHistory.user_id == current_user.id
    ).all()
    return history

@app.get("/api/user/stats/{category}")
async def get_category_stats(
    category: str,
    current_user: User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's stats for a specific category"""
    history = db.query(UserHistory).filter(
        UserHistory.user_id == current_user.id,
        UserHistory.category == category
    ).all()
    
    if not history:
        return {
            "total_attempts": 0,
            "average_time": 0,
            "correct_percentage": 0,
            "skipped_percentage": 0
        }
    
    total_attempts = len(history)
    total_time = sum(h.time for h in history)
    skipped_count = sum(1 for h in history if h.skipped)
    
    return {
        "total_attempts": total_attempts,
        "average_time": total_time / total_attempts if total_attempts > 0 else 0,
        "skipped_percentage": (skipped_count / total_attempts * 100) if total_attempts > 0 else 0
    }

# Add this class for request validation
class AttemptCreate(BaseModel):
    subject: str
    category: str
    moment: str
    difficulty: int
    skipped: bool
    time: int

@app.options("/api/attempts")
async def options_attempts():
    return {"message": "OK"}

@app.post("/api/attempts")
async def save_attempt(
    attempt: AttemptCreate,
    current_user: User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Save a question attempt in user history"""
    try:
        history = save_user_history(
            db=db,
            user_id=current_user.id,
            subject=attempt.subject,
            category=attempt.category,
            moment=attempt.moment,
            difficulty=attempt.difficulty,
            skipped=attempt.skipped,
            time=attempt.time
        )
        return {"status": "success", "history_id": history.id}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
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