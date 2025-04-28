import random as rd
from random import randint
from api.v1.core.services.equation_generator import integer_splitter, integer_expander, fraction_whole_number, integer_factorize
from api.v1.core.services.wrong_answer_generator import generate_x_equation_choices

# TODO explanaiton skriver inte in int1 ordentligt
##
def x_equation_addition(difficulty:int = 1):
    """
    Creates a question with one variable (x) solvable by adding to both sides

    Args:
        difficulty (int): Placeholder for now
    Returns:
        _type_: question_data
    """
    question_data = {
        "expression": integer_splitter(rd.randint(5,30)),
        }
    print(question_data)
    question_data.update({
        "answers": generate_x_equation_choices(question_data["expression"]),
        "correct_answer": question_data["expression"]["result"],
        "question": f"x - {question_data["expression"]["int1"]} = {question_data["expression"]["int2"]}"
        })
    print(question_data["correct_answer"])

    return {
        "subject": "kvantitativ",
        "category": "basics",
        "answers": question_data["answers"],
        "question": question_data["question"],
        "correct_answer": question_data["correct_answer"],
        "drawing": [],
        "explanation": "XEquationAddition.mp4"
    }

