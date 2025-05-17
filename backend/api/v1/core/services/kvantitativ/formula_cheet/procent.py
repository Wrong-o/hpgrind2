from api.v1.core.services.equation_generator import generate_percentage_basics, generate_percentage_interest
from api.v1.core.services.wrong_answer_generator import percentage_whole_number_wrong_answers, percentage_change_wrong_answers, percentage_interest_wrong_answers

def procent_grundläggande(difficulty: int = 1):
    """
    Generates a basic percentage question
    """
    data = generate_percentage_basics()
    question = f"Vad är {data['percentage']}% av {data['base_number']}?"
    correct_answer = data['result']
    choices = percentage_whole_number_wrong_answers(data['base_number'], data['percentage'])
    return {
        "subject": "kvantitativ",
        "category": "formula_cheet",
        "question": question,
        "answers": choices,
        "correct_answer": str(correct_answer),
        "drawing": [],
        "explanation": "PercentageBasic.mp4"
    }
    
def procent_förändring(difficulty: int = 1):
    """
    Generates a percentage change question
    Args:
        difficulty: int
    Returns:
    """
    data = generate_percentage_basics()
    question = f"Hur många procent av {data['base_number']} är {data['result']}?"
    correct_answer = data['percentage']
    choices = percentage_change_wrong_answers(data['base_number'], data['percentage'])
    return {
        "subject": "kvantitativ",
        "category": "formula_cheet",
        "question": question,
        "answers": choices,
        "correct_answer": str(correct_answer) + "%",
        "drawing": [],
        "explanation": "PercentageChange.mp4"
    }
def procent_ränta(difficulty: int = 1):
    data = generate_percentage_interest()
    question = f"Hur mycket ränta betalar du om du lånar {data['base_number']} kr i {data['time_period']} år med {data['interest_rate']}% ränta?"
    
    # data['result'] is now the simple interest amount directly
    correct_answer_numeric = data['result'] 

    # Pass the correct simple interest to the wrong answer generator
    choices = percentage_interest_wrong_answers(
        data['base_number'], 
        data['interest_rate'], 
        data['time_period'], 
        correct_answer_numeric # This is the correct simple interest
    )
    
    return {
        "subject": "kvantitativ",
        "category": "formula_cheet",
        "question": question,
        "answers": choices, # Expecting a list of strings from wrong_answer_generator
        "correct_answer": str(correct_answer_numeric), 
        "drawing": [],
        "explanation": "PercentageInterest.mp4" # Consider if a new video for simple interest is needed
    }