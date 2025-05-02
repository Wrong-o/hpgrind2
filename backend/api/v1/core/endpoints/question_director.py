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
from api.v1.core.services.kvantitativ.basics.fraction_equation import fraction_shortening
from api.v1.core.services.kvantitativ.basics.x_equation import x_equation_addition, x_equation_subtraction, x_equation_multiplication, x_equation_division
from api.v1.core.services.kvantitativ.formula_cheet.mean_mode_median import mean_even, mean_odd, mean_negative, median_even, median_odd, mode
from typing import List, Optional
from pydantic import BaseModel, Field, validator
import asyncio
import logging
import math
import random as rd
logger = logging.getLogger(__name__)
router = APIRouter()


moment_functions = {
    "basics_operations_order": operations_order,
    "basics_fraktioner_förkorta": fraction_shortening,
    "basics_fraktioner_addera": fraction_equation_addition,
    "basics_fraktioner_subtrahera": fraction_equation_subtraction,
    "basics_fraktioner_multiplicera": fraction_equation_multiplication,
    "basics_fraktioner_dividera": fraction_equation_division,
    "basics_ekvationslösning_addition": x_equation_addition,
    "basics_ekvationslösning_subtraktion": x_equation_subtraction,
    "basics_ekvationslösning_multiplikation": x_equation_multiplication,
    "basics_ekvationslösning_division": x_equation_division,
    "medelvärde_udda": mean_odd,
    "medelvärde_jämnt": mean_even,
    "medelvärde_negativa": mean_negative,
    "median_udda": median_odd,  
    "median_jämnt": median_even,
    "typvärde": mode
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
    question_data["answers"] = rd.sample(question_data["answers"], len(question_data["answers"]))
    question_data["moment"] = moment
    question_data["difficulty"] = difficulty
    return question_data


# Define request model for batch questions
class MomentProbability(BaseModel):
    moment: str
    probability: float = Field(gt=0, le=1, description="Probability of selecting this moment (must be between 0 and 1)")

class BatchQuestionRequest(BaseModel):
    moments: list[MomentProbability]
    difficulty: int
    count: int = 10  # Default to 10 questions

    @validator('moments')
    def validate_probabilities(cls, v):
        total_prob = sum(m.probability for m in v)
        if not math.isclose(total_prob, 1.0, rel_tol=1e-9):
            raise ValueError("Probabilities must sum to 1.0")
        return v


async def generate_question(moment: str, difficulty: int = 1):
    """
    Helper function to generate a single question asynchronously.
    This wraps the synchronous question generation function to be used with asyncio.
    """
    try:
        logger.info(f"Generating question for moment: {moment}, difficulty: {difficulty}")
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
    Returns a batch of questions based on the specified moments and their probabilities.
    
    Args:
        request: BatchQuestionRequest containing:
            - moments: List of moments and their probabilities
            - difficulty: Difficulty level for all questions
            - count: Number of questions to generate
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
        
        # Validate all moments exist
        for moment_prob in request.moments:
            if moment_prob.moment not in moment_functions:
                logger.warning(f"Moment not found: {moment_prob.moment}")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail=f"Moment not found: {moment_prob.moment}"
                )
        
        # Create a list of moments based on their probabilities
        weighted_moments = []
        for moment_prob in request.moments:
            num_questions = round(request.count * moment_prob.probability)
            weighted_moments.extend([moment_prob.moment] * num_questions)
        
        # Adjust the list length to match exactly request.count
        while len(weighted_moments) < request.count:
            weighted_moments.append(request.moments[0].moment)
        while len(weighted_moments) > request.count:
            weighted_moments.pop()
        
        logger.info(f"Generating {len(weighted_moments)} questions with distribution: {weighted_moments}")
        
        # Create tasks for concurrent execution
        tasks = []
        for moment in weighted_moments:
            tasks.append(generate_question(moment, request.difficulty))
        
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



