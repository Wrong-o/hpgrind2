from sqlalchemy.orm import Session
from models.database_models import UserCategoryProgress, QuestionAttempt, Question
from datetime import datetime

def record_attempt(db: Session, user_id: int, question_id: int, is_correct: bool, time_taken: int):
    # Record the attempt
    attempt = QuestionAttempt(
        user_id=user_id,
        question_id=question_id,
        is_correct=is_correct,
        time_taken=time_taken
    )
    db.add(attempt)
    
    # Get question category
    question = db.query(Question).filter(Question.id == question_id).first()
    
    # Update category progress
    progress = db.query(UserCategoryProgress).filter(
        UserCategoryProgress.user_id == user_id,
        UserCategoryProgress.category_id == question.category_id
    ).first()
    
    if not progress:
        progress = UserCategoryProgress(
            user_id=user_id,
            category_id=question.category_id
        )
        db.add(progress)
    
    # Update progress metrics
    progress.total_attempts += 1
    progress.last_attempt = datetime.utcnow()
    
    # Calculate new accuracy
    total_correct = db.query(QuestionAttempt).filter(
        QuestionAttempt.user_id == user_id,
        QuestionAttempt.question_id == question_id,
        QuestionAttempt.is_correct == True
    ).count()
    
    progress.accuracy = (total_correct / progress.total_attempts) * 100
    
    # Calculate average time
    avg_time = db.query(func.avg(QuestionAttempt.time_taken)).filter(
        QuestionAttempt.user_id == user_id,
        QuestionAttempt.question_id == question_id
    ).scalar()
    
    progress.avg_time = avg_time
    
    # Calculate progress score (example formula)
    time_factor = question.expected_time / progress.avg_time
    progress.progress_score = progress.accuracy * time_factor
    
    db.commit()
    return progress 