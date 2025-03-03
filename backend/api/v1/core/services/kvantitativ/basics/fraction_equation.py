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

    if difficulty == 1:
        fraction1 = random_fraction(max_numerator=10, max_denominator=10)
        fraction2 = random_fraction(max_numerator=10, max_denominator=10)
        operator = rd.choice(["-", "+"])
        if operator == "-":
            denominator = fraction1["denominator"] * fraction2["denominator"]
            numerator = fraction1["numerator"] * fraction2["denominator"] - \
                fraction2["numerator"] * fraction1["denominator"]
            question = f"\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}} - \\frac{{{fraction2['numerator']}}}{{{fraction2['denominator']}}}"
        else:
            denominator = fraction1["denominator"] * fraction2["denominator"]
            numerator = fraction1["numerator"] * fraction2["denominator"] + \
                fraction2["numerator"] * fraction1["denominator"]
            question = f"\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}} + \\frac{{{fraction2['numerator']}}}{{{fraction2['denominator']}}}"

    elif difficulty == 2:
        fraction1 = random_fraction(max_numerator=10, max_denominator=10)
        fraction2 = random_fraction(max_numerator=10, max_denominator=10)
        operator = rd.choice(["/", "*"])
        if operator == "/":
            numerator = fraction1["numerator"] * fraction2["denominator"]
            denominator = fraction1["denominator"] * fraction2["numerator"]
            question = f"\\frac{{\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}}}}{{\\frac{{{fraction2['numerator']}}}{{{fraction2['denominator']}}}}}"
        else:
            numerator = fraction1["numerator"] * fraction2["numerator"]
            denominator = fraction1["denominator"] * fraction2["denominator"]
            question = f"\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}} \\cdot \\frac{{{fraction2['numerator']}}}{{{fraction2['denominator']}}}"

    else:
        fraction1 = random_fraction(
            max_numerator=10, max_denominator=10, negative_allowed=True)
        fraction2 = random_fraction(
            max_numerator=10, max_denominator=10, negative_allowed=True)
        operator = rd.choice(["-", "+", "/", "*"])
        if operator == "-":
            numerator = fraction1["numerator"] * fraction2["denominator"] - \
                fraction2["numerator"] * fraction1["denominator"]
            denominator = fraction1["denominator"] * fraction2["denominator"]
            question = f"\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}} - \\frac{{{fraction2['numerator']}}}{{{fraction2['denominator']}}}"
        elif operator == "+":
            numerator = fraction1["numerator"] * fraction2["denominator"] + \
                fraction2["numerator"] * fraction1["denominator"]
            denominator = fraction1["denominator"] * fraction2["denominator"]
            question = f"\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}} + \\frac{{{fraction2['numerator']}}}{{{fraction2['denominator']}}}"
        elif operator == "/":
            numerator = fraction1["numerator"] * fraction2["denominator"]
            denominator = fraction1["denominator"] * fraction2["numerator"]
            question = f"\\frac{{\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}}}}{{\\frac{{{fraction2['numerator']}}}{{{fraction2['denominator']}}}}}"
        else:
            numerator = fraction1["numerator"] * fraction2["numerator"]
            denominator = fraction1["denominator"] * fraction2["denominator"]
            question = f"\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}} \\cdot \\frac{{{fraction2['numerator']}}}{{{fraction2['denominator']}}}"

    answer = f"\\frac{{{numerator}}}{{{denominator}}}"

    return {
        "subject": "kvantitativ",
        "category": "basics",
        "question": question,
        "answers": "",
        "correct_answer": answer,
        "drawing": [],
        "explanation": ""
    }
