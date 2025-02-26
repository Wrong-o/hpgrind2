from db_setup import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, insert, select, update
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy.exc import IntegrityError
from api.v1.core.services.kvantitativa.basics.operations_order import operations_order

router = APIRouter()


@router.get("/{moment}{difficulty}", status_code=200)
def get_question(moment: str, difficulty: int, db: Session = Depends(get_db)):
    """_summary_
    This function is the endpoint for question generation. 
    It routes uses services to generate a specific question based on userdata.

    Args:
        db (Session, optional): _description_. Defaults to Depends(get_db).

    Raises:
        HTTPException: _description_

    Returns:
        Dictionary: 
        subject: string - the subject of the question
        category: string - the category of the question
        moment: string - the moment of the question
        difficulty: int - the difficulty of the question
        question: string (Latex) - the question
        answers: list of strings (Latex) - the answers
        correct_answer: string - the correct answer
        drawing: list of lists - drawing if needed
        explanation: string (Latex) - the explanation
    """
    question = operations_order(difficulty=difficulty)
    return question
