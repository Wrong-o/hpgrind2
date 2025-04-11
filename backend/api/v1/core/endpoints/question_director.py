from db_setup import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, insert, select, update
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy.exc import IntegrityError
from api.v1.core.services.kvantitativ.basics.operations_order import operations_order
from api.v1.core.services.kvantitativ.basics.fraction_equation import fraction_equation_division
from api.v1.core.services.kvantitativ.basics.fraction_equation import fraction_equation_multiplication
from api.v1.core.services.kvantitativ.basics.fraction_equation import fraction_equation_addition
from api.v1.core.services.kvantitativ.basics.fraction_equation import fraction_equation_subtraction
from api.v1.core.services.kvantitativ.basics.x_solve import x_solve
from api.v1.core.services.kvantitativ.formula_cheet.mean import mean
from typing import List, Optional
from pydantic import BaseModel
import asyncio
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


moment_functions = {
    "operations_order": operations_order,
    #"basics_fraktioner_förlänga": fraction_equations,
    #"basics_fraktioner_förkorta": fraction_equations,
    "basics_fraktioner_addera": fraction_equation_addition,
    "basics_fraktioner_subtrahera": fraction_equation_subtraction,
    "basics_fraktioner_multiplicera": fraction_equation_multiplication,
    "basics_fraktioner_dividera": fraction_equation_division,
    "x_solve": x_solve,
    "mean": mean
}


@router.get("/{moment}{difficulty}", status_code=200)
async def get_question(moment: str, difficulty: int = 1, db: Session = Depends(get_db)):
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

    question_data["moment"] = moment
    question_data["difficulty"] = difficulty
    return question_data


# Define request model for batch questions
class BatchQuestionRequest(BaseModel):
    moment: str
    difficulty: int
    count: int = 10  # Default to 10 questions


async def generate_question(moment: str, difficulty: int):
    """
    Helper function to generate a single question asynchronously.
    This wraps the synchronous question generation function to be used with asyncio.
    """
    try:
        logger.info(f"Generating question for moment: {moment}, difficulty: {difficulty}")
        # Since moment_functions are synchronous, run them in a thread pool
        # to avoid blocking the event loop
        loop = asyncio.get_running_loop()
        question_data = await loop.run_in_executor(
            None, lambda: moment_functions[moment](difficulty=difficulty)
        )
        
        question_data["moment"] = moment
        question_data["difficulty"] = difficulty
        logger.info(f"Successfully generated question for {moment}")
        return question_data
    except Exception as e:
        logger.error(f"Error generating question: {str(e)}", exc_info=True)
        raise


@router.post("/batch", status_code=200)
async def get_batch_questions(request: BatchQuestionRequest, db: Session = Depends(get_db)):
    """
    Endpoint for efficiently fetching multiple questions concurrently.
    Returns a batch of questions of the specified moment and difficulty.
    
    Args:
        request: BatchQuestionRequest containing moment, difficulty, and count
        db: Database session

    Returns:
        List of question dictionaries containing:
        - subject: string - the subject of the question
        - category: string - the category of the question
        - moment: string - the moment of the question
        - difficulty: int - the difficulty of the question
        - question: string (Latex) - the question
        - answers: list of strings (Latex) - the answers
        - correct_answer: string - the correct answer
        - drawing: list of lists - drawing if needed
        - explanation: string (Latex) - the explanation
    """
    try:
        logger.info(f"Received batch question request: {request}")
        
        if request.moment not in moment_functions:
            logger.warning(f"Moment not found: {request.moment}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"Moment not found: {request.moment}"
            )
        
        logger.info(f"Generating {request.count} questions concurrently for moment: {request.moment}")
        
        # Create tasks for concurrent execution
        tasks = []
        for i in range(request.count):
            # Create a task for each question
            tasks.append(generate_question(request.moment, request.difficulty))
        
        # Wait for all tasks to complete concurrently
        questions = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Filter out any exceptions
        valid_questions = []
        for q in questions:
            if isinstance(q, Exception):
                logger.error(f"Question generation failed: {str(q)}")
            else:
                valid_questions.append(q)
        
        logger.info(f"Successfully generated {len(valid_questions)} questions")
        
        return valid_questions
    except Exception as e:
        logger.error(f"Error generating batch questions: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to generate batch questions: {str(e)}"
        )



