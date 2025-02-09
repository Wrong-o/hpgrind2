from typing import List, Dict, Any
import random
import uuid

def generate_nog_question(delmoment_list: List[str]) -> Dict[str, Any]:
    """
    Generate a NOG (numerical/graphical) question.
    
    Args:
        delmoment_list: List of applicable delmoment for this question
        
    Returns:
        Dict containing question data
    """
    return {
        "id": str(uuid.uuid4()),  # Generate a unique ID for each question
        "question": "Question text here",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correct_answer": "Option 1",
        "graph_data": {},
        "amne": "Kvantitativ",
        "provdel": "NOG",
        "delmoment": delmoment_list,
        "difficulty": 3.0,
        "explanation": "Explanation here"
    } 