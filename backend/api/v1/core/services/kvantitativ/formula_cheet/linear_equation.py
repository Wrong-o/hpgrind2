import random as rd
from api.v1.core.services.wrong_answer_generator import generate_linear_equation_choices
from api.v1.core.services.equation_generator import generate_linear_km

def linear_find_x(difficulty: int = 1, n = 5):
    """
    Generates a linear equation and returns the value of x
    """
    

    equation = generate_linear_km()
    choices = generate_linear_equation_choices(equation)
    
    return {
        "subject": "Subject",
        "category": "Category",
        "question": f"{equation['k']}x + {equation['m']} = {equation['y']}", 
        "answers": [f"{equation['x']}", f"{equation['x'] + 1}", f"{equation['x'] + 2}", f"{equation['x'] + 3}"],
        "correct_answer": f"{equation['x']}",
        "explanation": "Video.mp4"
    }

def linear_find_y(difficulty: int = 1, n = 5):
    """
    Generates a linear equation and returns the value of y
    """
    return {
        "subject": "Subject",
        "category": "Category",
        "question": "Question",
        "answers": ["1", "3", "4", "5"],
        "correct_answer": "1",
        "explanation": "Video.mp4"
    }
