from db_setup import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, insert, select, update
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy.exc import IntegrityError
from api.v1.core.services.kvantitativ.basics.operations_order import operations_order
from api.v1.core.services.kvantitativ.basics.fraction_equation import fraction_equations

from api.v1.core.services.explanations import explanation as get_explanation

router = APIRouter()


moment_functions = {
    "operations_order": operations_order,
    "fraction_equation": fraction_equations
}


@router.get("/{moment}{difficulty}", status_code=200)
def get_question(moment: str, difficulty: int, db: Session = Depends(get_db)):
    """_summary_
    This is the endpoint for getting a question data.
    It uses the moment and difficulty to generate a question and relevant 
    explanations, drawings and answers.
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
    if moment not in moment_functions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Moment not found")
    question_data = moment_functions[moment](difficulty=difficulty)

    question_data["explanation"] = get_explanation(
        moment, difficulty=difficulty)
    question_data["moment"] = moment
    question_data["difficulty"] = difficulty
    return question_data
