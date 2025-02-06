from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from quiz_generator import generate_math_question, QuizQuestion
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List
import models, auth
from database import get_db, engine
from services.user_service import create_user, authenticate_user
from models.pydantic_models import UserCreate, Token
from services.stats_service import UserStats
from services.recommendation_service import RecommendationEngine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Move CORS middleware configuration to the top
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"message": str(exc)},
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
    db_user = create_user(db, user)
    return db_user

@app.post("/api/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# Protected route example
@app.get("/api/me", response_model=models.User)
async def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.get("/api/user/stats")
async def get_user_stats(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    stats = UserStats(db, current_user.id)
    return stats.get_overall_stats()

@app.get("/api/user/recommendations")
async def get_recommendations(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    engine = RecommendationEngine(db, current_user.id)
    return {
        "next_category": engine.get_next_recommended_category(),
        "recommended_questions": engine.get_recommended_questions()
    }

@app.get("/api/user/achievements")
async def get_achievements(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    achievements = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id
    ).all()
    return achievements