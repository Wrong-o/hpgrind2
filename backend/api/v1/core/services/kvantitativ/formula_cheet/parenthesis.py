from api.v1.core.services.equation_generator import generate_square_formula
from api.v1.core.services.wrong_answer_generator import generate_square_formula_wrong_answers

def square_formula_positive(difficulty: int = 1, n = 5):
    """
    Generates a question with a squaring formula (a+b)^2
    """
    data = generate_square_formula(difficulty, operator="+")
    # generate_square_formula_wrong_answers for '+' operator includes the correct answer
    answers_int = generate_square_formula_wrong_answers(data["int1"], data["int2"], data["operator"])
    correct_answer_int = data["result"]
    
    answers_str = [str(ans) for ans in answers_int]
    correct_answer_str = str(correct_answer_int)
    
    return {
        "subject": "kvantitativ",
        "category": "formula_cheet",
        "question": data["formula"],
        "answers": answers_str,
        "correct_answer": correct_answer_str,
        "drawing": [],
        "explanation": "ConjugateFormula.mp4" # Should be SquareFormulaPositive.mp4 or similar
    }

def square_formula_negative(difficulty: int = 1, n = 5):
    """
    Generates a question with a squaring formula (a-b)^2
    """
    data = generate_square_formula(difficulty, operator="-")
    # generate_square_formula_wrong_answers for '-' operator includes the correct answer
    answers_int = generate_square_formula_wrong_answers(data["int1"], data["int2"], data["operator"])
    correct_answer_int = data["result"]
    
    answers_str = [str(ans) for ans in answers_int]
    correct_answer_str = str(correct_answer_int)
    
    return {
        "subject": "kvantitativ",
        "category": "formula_cheet",
        "question": data["formula"],
        "answers": answers_str,
        "correct_answer": correct_answer_str,
        "drawing": [],
        "explanation": "ConjugateFormula.mp4" # Should be SquareFormulaNegative.mp4 or similar
    }

def conjugate_formula(difficulty: int = 1, n = 5):
    """
    Generates a question with a conjugate formula (a+b)(a-b)
    """
    data = generate_square_formula(difficulty, operator=None) # Operator is None for conjugate
    # generate_square_formula_wrong_answers for None operator includes the correct answer
    answers_int = generate_square_formula_wrong_answers(data["int1"], data["int2"], data["operator"])
    correct_answer_int = data["result"]
    
    answers_str = [str(ans) for ans in answers_int]
    correct_answer_str = str(correct_answer_int)
    
    return {
        "subject": "kvantitativ",
        "category": "formula_cheet",
        "question": data["formula"],
        "answers": answers_str,
        "correct_answer": correct_answer_str,
        "drawing": [],
        "explanation": "ConjugateFormula.mp4"
    }

