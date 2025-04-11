import random as rd
from api.v1.core.services.equation_generator import random_fraction
from api.v1.core.services.wrong_answer_generator import generate_fraction_choices


def explanation(operator):
    """
    Returns the video file name for the given operator
    """
    if operator == "-":

        return "FractionSubtraction.mp4"

    if operator == "+":

        return "FractionAddition.mp4"

    if operator == "/":

        return "FractionDivision.mp4"

    if operator == "*":

        return "FractionMultiplication.mp4"

def fraction_equation_division(difficulty: int):
    """
    Generates a division question
    """
    
    fraction1 = random_fraction(max_numerator=10, max_denominator=10)
    fraction2 = random_fraction(max_numerator=10, max_denominator=10)
    operator = "/"
    question_data = {
        "fraction1": fraction1,
        "fraction2": fraction2,
        "operator": operator
    }
    question_data.update({
        "numerator": fraction1["numerator"] * fraction2["denominator"],
        "denominator": fraction1["denominator"] * fraction2["numerator"],
        "question": f"\\frac{{\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}}}}{{\\frac{{{fraction2['numerator']}}}{{{fraction2['denominator']}}}}}"
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
        "explanation": "FractionDivision.mp4"
    }

def fraction_equation_multiplication(difficulty: int):
    """
    Generates a multiplication question
    """
    fraction1 = random_fraction(max_numerator=10, max_denominator=10)
    fraction2 = random_fraction(max_numerator=10, max_denominator=10)
    operator = "*"
    question_data = {
        "fraction1": fraction1,
        "fraction2": fraction2,
        "operator": operator
    }
    question_data.update({
        "numerator": fraction1["numerator"] * fraction2["numerator"],
        "denominator": fraction1["denominator"] * fraction2["denominator"],
        "question": f"\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}} \\cdot \\frac{{{fraction2['numerator']}}}{{{fraction2['denominator']}}}",
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
        "explanation": "FractionMultiplication.mp4"
    }

def fraction_equation_addition(difficulty: int):
    """
    Generates an addition question
    """
    fraction1 = random_fraction(max_numerator=10, max_denominator=10)
    fraction2 = random_fraction(max_numerator=10, max_denominator=10)
    operator = "+"
    question_data = {
        "fraction1": fraction1,
        "fraction2": fraction2,
        "operator": operator
    }
    question_data.update({
        "denominator": fraction1["denominator"] * fraction2["denominator"],
        "numerator": fraction1["numerator"] * fraction2["denominator"] +
        fraction2["numerator"] * fraction1["denominator"],
        "question": f"\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}} + \\frac{{{fraction2['numerator']}}}{{{fraction2['denominator']}}}"
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
        "explanation": "FractionAddition.mp4"
    }

def fraction_equation_subtraction(difficulty: int):
    """
    Generates a subtraction question
    """
    fraction1 = random_fraction(max_numerator=10, max_denominator=10)
    fraction2 = random_fraction(max_numerator=10, max_denominator=10)
    operator = "-"
    question_data = {
        "fraction1": fraction1,
        "fraction2": fraction2,
        "operator": operator
    }
    question_data.update({
        "denominator": fraction1["denominator"] * fraction2["denominator"],
        "numerator": fraction1["numerator"] * fraction2["denominator"] -
        fraction2["numerator"] * fraction1["denominator"],
        "question": f"\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}} - \\frac{{{fraction2['numerator']}}}{{{fraction2['denominator']}}}"
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
        "explanation": "FractionSubtraction.mp4"
    }

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
        question_data["explanation"] = explanation(operator=operator)

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
