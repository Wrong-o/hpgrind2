from api.v1.core.services.equation_generator import generate_square_formula
from api.v1.core.services.wrong_answer_generator import generate_square_formula_wrong_answers
def square_formula_positive(difficulty: int = 1, n = 5):
    """
    Generates a question with a conjugate formula
    """
    data = generate_square_formula(difficulty, operator="+")
    answers = generate_square_formula_wrong_answers(data["int1"], data["int2"], data["operator"])
    correct_answer = data["result"]
    return {
        "subject": "kvantitativ",
        "category": "formula_cheet",
        "question": data["formula"],
        "answers": answers,
        "correct_answer": correct_answer,
        "drawing": [],
        "explanation": "ConjugateFormula.mp4"
    }



def square_formula_negative(difficulty: int = 1, n = 5):
    """
    Generates a question with a conjugate formula
    """
    data = generate_square_formula(difficulty, operator="-")
    answers = generate_square_formula_wrong_answers(data["int1"], data["int2"], data["operator"])
    correct_answer = data["result"]
    return {
        "subject": "kvantitativ",
        "category": "formula_cheet",
        "question": data["formula"],
        "answers": answers,
        "correct_answer": correct_answer,
        "drawing": [],
        "explanation": "ConjugateFormula.mp4"
    }




def conjugate_formula(difficulty: int = 1, n = 5):
    """
    Generates a question with a conjugate formula
    """
    data = generate_square_formula(difficulty)
    answers = generate_square_formula_wrong_answers(data["int1"], data["int2"], data["operator"])
    correct_answer = data["result"]
    return {
        "subject": "kvantitativ",
        "category": "formula_cheet",
        "question": data["formula"],
        "answers": answers,
        "correct_answer": correct_answer,
        "drawing": [],
        "explanation": "ConjugateFormula.mp4"
    }

