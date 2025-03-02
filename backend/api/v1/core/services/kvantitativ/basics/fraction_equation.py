import random as rd
from api.v1.core.services.equation_generator import random_fraction


def fraction_equations(difficulty: int):
    """_summary_ fraction_equations question with three different difficulties

    Args:
        difficulty (int): Different types of questions based on difficulty

    Returns:
        _type_: _description_
        subject: string = kvantitativ
        category: string = basics
        question: string (Latex) = the question
        answers: list of strings (Latex) = the answers
        correct_answer: string = the correct answer
        drawing: list of lists = drawing if needed
        explanation: string (Latex) = the explanation
    """

    fraction1, fraction2 = random_fraction(
        max_numerator=7, max_denominator=7), random_fraction(max_numerator=7, max_denominator=7)
    if difficulty == 1:
        denominator = fraction1["denominator"] + fraction2["denominator"]
        numerator = fraction1["numerator"] + fraction2["numerator"]
        answer = f"\\frac{{{numerator}}}{{{denominator}}}"
        # HÄR, fortsätt implementera difficulty logic
    return {
        "subject": "kvantitativ",
        "category": "basics",
        "question": "",
        "answers": answer,
        "correct_answer": "",
        "drawing": [],
        "explanation": ""
    }
