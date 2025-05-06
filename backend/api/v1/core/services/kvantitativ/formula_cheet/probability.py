import random as rd
from api.v1.core.services.equation_generator import divide_into_groups
from api.v1.core.services.wrong_answer_generator import generate_probability_choices


def probability_single(difficulty: int = 1, n = 7, n_groups = 2):
    """
    Generates a sequence and returns mean of the sequence
    Args:
        even_n (bool): If True, the sequence will have an even number of integers
        n (int): Number of integers in the sequence
        negative_allowed (bool): If True, the sequence will be negative
    Returns:
        mean (float): Mean of the sequence
    """
    groups = divide_into_groups(n, n_groups)
    correct_answer = f"{groups[0]} / {n}"
    choices = generate_probability_choices(groups)
    print(groups)
    if n_groups == 2:
        correct_color = rd.choice(["röd", "blå"])
        question = f"En påse innehåller {groups[0]} {correct_color} och {groups[1]} blåa kulor. Vad är sannolikheten att dra två kulor av {correct_color} om kulan du drar läggs tillbaka i påsen?"
    elif n_groups == 3:
        question = f"En påse innehåller {groups[0]} röda, {groups[1]} blåa och {groups[2]} gröna kulor. Vad är sannolikheten att dra en röd kula  of drawing {groups[0]} red balls from {n} balls"
    return {
        "subject": "kvantitativ",
        "category": "formula_cheet",
        "question": question,
        "answers": choices,
        "correct_answer": str(correct_answer),
        "drawing": [],
        "explanation": "Probability.mp4"
    }

def probability_combination_with_replacement(difficulty: int = 1, n = 7, n_groups = 2):
    """
    Generates a sequence and returns mean of the sequence
    Args:
        even_n (bool): If True, the sequence will have an even number of integers
    """
    groups = divide_into_groups(n, n_groups)
    correct_answer = f"{groups[0]**2} / {n**2}"
    choices = generate_probability_choices(groups)
    print(groups)
    ##Du är här: choices antar fortfarande att det inte är kombinationer
    if n_groups == 2:
        correct_color = rd.choice(["röd", "blå"])
    question = f"Vad är sannolikheten att dra två kulor av {correct_color} om kulan du drar läggs tillbaka i påsen?"
    return {
        "subject": "kvantitativ",
        "category": "formula_cheet",
        "question": question,
        "answers": choices,
        "correct_answer": str(correct_answer),
        "drawing": [],
        "explanation": "Probability.mp4"
    }
def probability_combination_without_replacement(difficulty: int = 1, n = 7, n_groups = 2):
    """
    Generates a sequence and returns mean of the sequence
    Args:
        even_n (bool): If True, the sequence will have an even number of integers
    """
    groups = divide_into_groups(n, n_groups)
    correct_answer = f"{groups[0]} / {n}"
    choices = generate_probability_choices(groups)
    print(groups)
    if n_groups == 2:
        correct_color = rd.choice(["röd", "blå"])
    return {
        "subject": "kvantitativ",
        "category": "formula_cheet",
        "question": question,
        "answers": choices,
        "correct_answer": str(correct_answer),
        "drawing": [],
        "explanation": "Probability.mp4"
    }