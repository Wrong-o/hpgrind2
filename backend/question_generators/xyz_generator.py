from typing import List, Dict, Any
import random
import uuid

def generate_xyz_question(delmoment_list: List[str]) -> Dict[str, Any]:
    """
    Generate an XYZ (algebra) question.
    
    Args:
        delmoment_list: List of applicable delmoment for this question
        
    Returns:
        Dict containing question data following the required format
    """
    # Example question (you can expand this with more question types)
    question_types = [
        {
            "subject": "Matematik",
            "category": "Algebra",
            "moment": delmoment_list[0] if delmoment_list else "Algebra",
            "difficulty": random.randint(1, 5),
            "question": "Förenkla uttrycket: $x^2 \\cdot x^3$",
            "answers": [
                "$x^5$",
                "$x^6$",
                "$x^8$",
                "$2x^5$"
            ],
            "correct_answer": "$x^5$",
            "drawing": [],
            "explanation": "När man multiplicerar potenser med samma bas adderar man exponenterna: $x^2 \\cdot x^3 = x^{2+3} = x^5$"
        },
        {
            "subject": "Matematik",
            "category": "Algebra",
            "moment": delmoment_list[0] if delmoment_list else "Algebra",
            "difficulty": random.randint(1, 5),
            "question": "Lös ekvationen: $2x + 5 = 13$",
            "answers": [
                "$x = 4$",
                "$x = 3$",
                "$x = 5$",
                "$x = 6$"
            ],
            "correct_answer": "$x = 4$",
            "drawing": [],
            "explanation": "För att lösa ekvationen:\n$2x + 5 = 13$\n$2x = 13 - 5 = 8$\n$x = \\frac{8}{2} = 4$"
        },
        {
            "subject": "Matematik",
            "category": "Algebra",
            "moment": delmoment_list[0] if delmoment_list else "Algebra",
            "difficulty": random.randint(1, 5),
            "question": "Förenkla uttrycket: $\\frac{x^2 \\cdot x^3}{x^2}$",
            "answers": [
                "$x^3$",
                "$x^4$",
                "$x^5$",
                "$x^2$"
            ],
            "correct_answer": "$x^3$",
            "drawing": [],
            "explanation": "När man dividerar potenser med samma bas subtraherar man exponenterna:\n$\\frac{x^2 \\cdot x^3}{x^2} = x^{2+3-2} = x^3$"
        }
    ]
    
    # Randomly select a question
    question_data = random.choice(question_types)
    
    # Randomize the order of answers
    answers = question_data["answers"].copy()
    random.shuffle(answers)
    question_data["answers"] = answers
    
    # Add unique ID
    question_data["id"] = str(uuid.uuid4())
    
    return question_data 