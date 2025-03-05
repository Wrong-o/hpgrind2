import random as rd
from api.v1.core.services.equation_generator import random_fraction
from api.v1.core.services.wrong_answer_generator import generate_fraction_choices


def explanation(operator):
    if operator == "-":

        return r"""
        \text{1. Se till att bråken har samma nämnare (siffran där nere)} \\
        \text{2. Gångra det över och under sträcket med andra bråkets nämnare på båda sidor}
        \text{3. Ta täljaren på det första bråket minus täljaren på det andra}
        """

    if operator == "+":

        return r"""
        \text{1. Se till att bråken har samma nämnare (siffran där nere)} \\
        \text{2. Gångra det över och under sträcket med andra bråkets nämnare på båda sidor}
        \text{3. Ta täljaren på det första bråket plus täljaren på det andra}
        """

    if operator == "/":

        return r"""
        \text{1. Byt plats på de två siffrorna i nedre bråket} \\
        \text{2. Lyft upp det nedre bråket bredvid det övre bråket}
        \text{3. Gångra täljarna med varandra och nämnarna med varandra}
        """

    if operator == "*":

        return r"""
        \text{1. Gångra täljarna med varandra och nämnarna med varandra}
        """


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
        question_data = {
            "fraction1": fraction1,
            "fraction2": fraction2,
            "operator": operator
        }
        if operator == "-":
            question_data.update({
                "denominator": fraction1["denominator"] * fraction2["denominator"],
                "numerator": fraction1["numerator"] * fraction2["denominator"] -
                fraction2["numerator"] * fraction1["denominator"],
                "question": f"\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}} - \\frac{{{fraction2['numerator']}}}{{{fraction2['denominator']}}}"
            })
        else:
            question_data.update({
                "denominator": fraction1["denominator"] * fraction2["denominator"],
                "numerator": fraction1["numerator"] * fraction2["denominator"] +
                fraction2["numerator"] * fraction1["denominator"],
                "question": f"\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}} + \\frac{{{fraction2['numerator']}}}{{{fraction2['denominator']}}}"
            })

    elif difficulty == 2:
        fraction1 = random_fraction(max_numerator=10, max_denominator=10)
        fraction2 = random_fraction(max_numerator=10, max_denominator=10)
        operator = rd.choice(["/", "*"])
        question_data = {
            "fraction1": fraction1,
            "fraction2": fraction2,
            "operator": operator
        }
        if operator == "/":
            question_data.update({
                "numerator": fraction1["numerator"] * fraction2["denominator"],
                "denominator": fraction1["denominator"] * fraction2["numerator"],
                "question": f"\\frac{{\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}}}}{{\\frac{{{fraction2['numerator']}}}{{{fraction2['denominator']}}}}}"
            })
        else:
            question_data.update({
                "numerator": fraction1["numerator"] * fraction2["numerator"],
                "denominator": fraction1["denominator"] * fraction2["denominator"],
                "question": f"\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}} \\cdot \\frac{{{fraction2['numerator']}}}{{{fraction2['denominator']}}}",
            })

    else:
        fraction1 = random_fraction(
            max_numerator=10, max_denominator=10, negative_allowed=True)
        fraction2 = random_fraction(
            max_numerator=10, max_denominator=10, negative_allowed=True)
        operator = rd.choice(["-", "+", "/", "*"])
        question_data = {
            "fraction1": fraction1,
            "fraction2": fraction2,
            "operator": operator
        }
        if operator == "-":
            question_data.update({
                "numerator": fraction1["numerator"] * fraction2["denominator"] -
                fraction2["numerator"] * fraction1["denominator"],
                "denominator": fraction1["denominator"] * fraction2["denominator"],
                "question": f"\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}} - \\frac{{{fraction2['numerator']}}}{{{fraction2['denominator']}}}"
            })
        elif operator == "+":
            question_data.update({
                "numerator": fraction1["numerator"] * fraction2["denominator"] +
                fraction2["numerator"] * fraction1["denominator"],
                "denominator": fraction1["denominator"] * fraction2["denominator"],
                "question": f"\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}} + \\frac{{{fraction2['numerator']}}}{{{fraction2['denominator']}}}"
            })
        elif operator == "/":
            question_data.update({
                "numerator": fraction1["numerator"] * fraction2["denominator"],
                "denominator": fraction1["denominator"] * fraction2["numerator"],
                "question": f"\\frac{{\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}}}}{{\\frac{{{fraction2['numerator']}}}{{{fraction2['denominator']}}}}}"
            })
        else:
            question_data.update({
                "numerator": fraction1["numerator"] * fraction2["numerator"],
                "denominator": fraction1["denominator"] * fraction2["denominator"],
                "question": f"\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}} \\cdot \\frac{{{fraction2['numerator']}}}{{{fraction2['denominator']}}}"
            })

    wrong_answer_tracker = [fraction1, operator, fraction2]
    question_data["correct_answer"] = f"\\frac{{{question_data['numerator']}}}{{{question_data['denominator']}}}"
    question_data["answers"] = generate_fraction_choices(
        wrong_answer_tracker, question_data["correct_answer"])
    return {
        "subject": "kvantitativ",
        "category": "basics",
        "question": question_data["question"],
        "answers": question_data["answers"],
        "correct_answer": question_data["correct_answer"],
        "drawing": [],
        "explanation": explanation(operator=operator)
    }
