import random as rd
from api.v1.core.services.equation_generator import generate_sequence


def mean(difficulty):
    if difficulty == 1:
        sequence = generate_sequence(1, 20)
    if difficulty == 2:
        sequence = generate_sequence(-20, 20, n=8)
    if difficulty == 3:
        pass

    return {
        "subject": "kvantitativ",
        "category": "formula_cheet",
        "question": sequence,
        # "answers": question_data["answers"],
        "correct_answer": "",
        "drawing": [],
        # "explanation": explanation(operator=operator, int1=int1, int2=int2)
    }
