from typing import List, Dict, Any
import random

def generate_pro_question(delmoment_list: List[str]) -> Dict[str, Any]:
    """
    Generate a PRO (problem solving) question.
    
    Args:
        delmoment_list: List of applicable delmoment for this question
        
    Returns:
        Dict containing question data
    """
    return {
        "question": "Question text here",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correct_answer": "Option 1",
        "problem_data": {},
        "amne": "Kvalitativ",
        "provdel": "PRO",
        "delmoment": delmoment_list,
        "difficulty": 3.0,
        "explanation": "Explanation here"
    } 