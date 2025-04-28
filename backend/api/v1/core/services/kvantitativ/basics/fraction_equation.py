import random as rd
from api.v1.core.services.equation_generator import random_fraction, fraction_shortened
from api.v1.core.services.wrong_answer_generator import generate_fraction_choices, generate_fraction_shortening_choices


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



def fraction_shortening(difficulty: int):
    """
    Generates a shortening question
    """
    
    fraction1 = fraction_shortened(rd.randint(1, 10), rd.randint(1, 10))
    extend_factor = rd.randint(1, 10)
    question_data = {
        "fraction1": fraction1,
        "extend_factor": extend_factor
    }
    question_data.update({
        "question": f"\\frac{{{fraction1['numerator'] * extend_factor}}}{{{fraction1['denominator'] * extend_factor}}}"
    })
    question_data["correct_answer"] = f"\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}}"
    question_data["answers"] = generate_fraction_shortening_choices(
        fraction1, question_data["correct_answer"])
    return {
        "subject": "kvantitativ",
        "category": "basics",
        "question": question_data["question"],
        "answers": question_data["answers"],
        "correct_answer": question_data["correct_answer"],
        "drawing": [],
        "explanation": "FractionShortening.mp4"
    }

def fraction_expanding(difficulty: int):
    """
    Generates a expanding question
    """
    
    fraction1 = fraction_shortened(rd.randint(1, 10), rd.randint(1, 10))
    extend_factor = rd.randint(1, 10)
    question_data = {
        "fraction1": fraction1,
        "extend_factor": extend_factor
    }
    question_data.update({
        "question": f"\\frac{{{fraction1['numerator'] * extend_factor}}}{{{fraction1['denominator'] * extend_factor}}}"
    })
    question_data["correct_answer"] = f"\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}}"
    question_data["answers"] = generate_fraction_shortening_choices(
        fraction1, question_data["correct_answer"])
    return {
        "subject": "kvantitativ",
        "category": "basics",
        "question": question_data["question"],
        "answers": question_data["answers"],
        "correct_answer": question_data["correct_answer"],
        "drawing": [],
        "explanation": "FractionShortening.mp4"
    }
