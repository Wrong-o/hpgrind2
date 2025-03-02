import random as rd
from api.v1.core.services.equation_generator import fraction_equation


def fraction_equations(difficulty: int):
    """_summary_ fraction_equations question with three different difficulties

    Args:
        difficulty (int): Different types of qustions based on difficulty

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

    fraction1 = fraction_equation()
    print(fraction1)

    return {
        "subject": "kvantitativ",
        "category": "basics",
        "question": question_data["question"],
        "answers": question_data["answers"],
        "correct_answer": str(question_data["correct_answer"]),
        "drawing": [],
        "explanation": ""
    }
