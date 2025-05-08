import random as rd
from api.v1.core.services.equation_generator import divide_into_groups, fraction_shortened
from api.v1.core.services.wrong_answer_generator import generate_probability_choices, generate_probability_combination_with_replacement_choices, generate_probability_combination_without_replacement_choices
import math

def probability_single(difficulty: int = 1, n = None, n_groups = None):
    """
    Generates a sequence and returns mean of the sequence
    Args:
        even_n (bool): If True, the sequence will have an even number of integers
        n (int): Number of integers in the sequence
        negative_allowed (bool): If True, the sequence will be negative
    Returns:
        mean (float): Mean of the sequence
    """
    if not n:
        n = rd.randint(5, 15)
    if not n_groups:
        n_groups = rd.randint(2, 3)
    groups = divide_into_groups(n, n_groups)
    shortened = fraction_shortened(numerator=groups[0], denominator=n)
    correct_answer = f"\\frac{{{shortened['numerator']}}}{{{shortened['denominator']}}}"
    choices = generate_probability_choices(groups)
    if n_groups == 2:
        question = f"En påse innehåller {groups[0]} blå och {groups[1]} röda kulor. Vad är sannolikheten att dra en röd kula?"
    elif n_groups == 3:
        question = f"En påse innehåller {groups[0]} röda, {groups[1]} blåa och {groups[2]} gröna kulor. Vad är sannolikheten att dra en röd kula?"
    return {
        "subject": "kvantitativ",
        "category": "formula_cheet",
        "question": question,
        "answers": choices,
        "correct_answer": str(correct_answer),
        "drawing": [],
        "explanation": "Probability.mp4"
    }

def probability_combination_with_replacement(difficulty: int = 1, n = None, n_groups = 2):
    """
    Generates a sequence and returns mean of the sequence
    Args:
        even_n (bool): If True, the sequence will have an even number of integers
    """
    if not n:
        n = rd.randint(5, 15)

    groups = divide_into_groups(n, n_groups)
    shortened = fraction_shortened(numerator=groups[0]**2, denominator=n**2)
    correct_answer = f"\\frac{{{shortened['numerator']}}}{{{shortened['denominator']}}}"
    choices = generate_probability_combination_with_replacement_choices(groups)

    question = f"En påse innehåller {groups[0]} blåa och {groups[1]} röda kulor. Vad är sannolikheten att dra två blåakulor om i rad om kulan du drar läggs tillbaka i påsen?"

    return {
        "subject": "kvantitativ",
        "category": "formula_cheet",
        "question": question,
        "answers": choices,
        "correct_answer": str(correct_answer),
        "drawing": [],
        "explanation": "Probability.mp4"
    }
def probability_combination_without_replacement(difficulty: int = 1, n = None, n_groups = 2):
    """
    Generates a sequence and returns mean of the sequence
    Args:
        even_n (bool): If True, the sequence will have an even number of integers
    """
    if not n:
        n = rd.randint(5, 15)

    groups = divide_into_groups(n, n_groups)
    num = groups[0] * (groups[0] - 1)
    den = n * (n - 1)
    gcd = math.gcd(num, den)
    correct_answer = f"\\frac{{{num // gcd}}}{{{den // gcd}}}"
    choices = generate_probability_combination_without_replacement_choices(groups)
    print(groups)
    if n_groups == 2:
        correct_color = rd.choice(["röd", "blå"])
    question = f"En påse innehåller {groups[0]} {correct_color} och {groups[1]} blåa kulor. Vad är sannolikheten att dra två {correct_color}a kulor om i rad om kulan inte läggs tillbaka efter varje dragning?"
    print(correct_answer)
    return {
        "subject": "kvantitativ",
        "category": "formula_cheet",
        "question": question,
        "answers": choices,
        "correct_answer": str(correct_answer),
        "drawing": [],
        "explanation": "Probability.mp4"
    }