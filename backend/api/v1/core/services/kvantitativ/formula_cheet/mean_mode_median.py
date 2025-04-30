import random as rd
from api.v1.core.services.equation_generator import generate_sequence_mean, generate_sequence_median
from api.v1.core.services.wrong_answer_generator import generate_mean_choices, generate_median_choices


def mean_even(difficulty: int = 1, n = 6):
    """
    Generates a sequence and returns mean of the sequence
    Args:
        even_n (bool): If True, the sequence will have an even number of integers
        n (int): Number of integers in the sequence
        negative_allowed (bool): If True, the sequence will be negative
    Returns:
        mean (float): Mean of the sequence
    """
    sequence = generate_sequence_mean(integers_only=True, even_n=True, n=n, negative_allowed=False)
    sequence["sequence"].sort()
    choices = generate_mean_choices(sequence)
    return {
        "subject": "kvantitativ",
        "category": "formula_cheet",
        "question": ", ".join(str(x) for x in sequence["sequence"]),
        "answers": choices,
        "correct_answer": str(sequence["mean"]),
        "drawing": [],
        "explanation": "MeanEven.mp4"
    }


def mean_odd(difficulty: int = 1, n = 5):
    """
    Generates a sequence and returns mean of the sequence
    Args:
        even_n (bool): If True, the sequence will have an even number of integers
        n (int): Number of integers in the sequence
        negative_allowed (bool): If True, the sequence will be negative
    Returns:
        mean (float): Mean of the sequence
    """
    sequence = generate_sequence_mean(integers_only=True, even_n=False, n=n, negative_allowed=False)
    sequence["sequence"].sort()
    choices = generate_mean_choices(sequence)
    return {
        "subject": "kvantitativ",
        "category": "formula_cheet",
        "question": ", ".join(str(x) for x in sequence["sequence"]),
        "answers": choices,
        "correct_answer": str(sequence["mean"]),
        "drawing": [],
        "explanation": "MeanOdd.mp4"
    }
def mean_negative(difficulty: int = 1, n = 5):
    """
    Generates a sequence and returns mean of the sequence
    Args:
        even_n (bool): If True, the sequence will have an even number of integers
        n (int): Number of integers in the sequence
        negative_allowed (bool): If True, the sequence will be negative
    Returns:
        mean (float): Mean of the sequence
    """
    sequence = generate_sequence_mean(integers_only=True, even_n=False, n=n, negative_allowed=True)
    sequence["sequence"].sort()
    choices = generate_mean_choices(sequence)
    return {
        "subject": "kvantitativ",
        "category": "formula_cheet",
        "question": ", ".join(str(x) for x in sequence["sequence"]),
        "answers": choices,
        "correct_answer": str(sequence["mean"]),
        "drawing": [],
        "explanation": "MeanNegative.mp4"
    }

def median_even(difficulty: int = 1, n = 5):
    """
    Generates a sequence and returns median of the sequence
    Args:
        even_n (bool): If True, the sequence will have an even number of integers
        n (int): Number of integers in the sequence
        negative_allowed (bool): If True, the sequence will be negative
    Returns:
        mean (float): Mean of the sequence
    """
    sequence = generate_sequence_median(integers_only=True, even_n=True, n=n, negative_allowed=False)
    sequence["sequence"].sort()
    choices = generate_median_choices(sequence)
    print(sequence, choices)
    return {
        "subject": "kvantitativ",
        "category": "formula_cheet",
        "question": ", ".join(str(x) for x in sequence["sequence"]),
        "answers": choices,
        "correct_answer": str(sequence["median"]),
        "drawing": [],
        "explanation": "MedianEven.mp4"
    }

def median_odd(difficulty: int = 1, n = 5):
    """
    Generates a sequence and returns median of the sequence
    Args:
        even_n (bool): If True, the sequence will have an even number of integers
        n (int): Number of integers in the sequence
        negative_allowed (bool): If True, the sequence will be negative
    Returns:
        mean (float): Mean of the sequence
    """
    return {
        "subject": "kvantitativ",
        "category": "formula_cheet",
        "question": ", ".join(str(x) for x in sequence["sequence"]),
        "answers": choices,
        "correct_answer": str(sequence["median"]),
        "drawing": [],
        "explanation": "MedianEven.mp4"
    }