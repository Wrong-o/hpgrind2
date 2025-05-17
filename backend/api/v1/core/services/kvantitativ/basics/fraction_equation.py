import random as rd
from api.v1.core.services.equation_generator import random_fraction, fraction_shortened
from api.v1.core.services.wrong_answer_generator import generate_fraction_choices, generate_fraction_shortening_choices
import math


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

def format_fraction_answer(fraction):
    """
    Format a fraction as LaTeX with the minus sign outside the fraction for negative values.
    
    Args:
        fraction: A Fraction object or string containing a LaTeX fraction
        
    Returns:
        str: LaTeX representation with minus sign outside fraction if negative
    """
    from fractions import Fraction
    
    # If the fraction is already a string, return it
    if isinstance(fraction, str):
        return fraction
        
    # Handle the negative sign placement for Fraction objects
    if fraction.numerator < 0:
        return f"-\\frac{{{abs(fraction.numerator)}}}{{{fraction.denominator}}}"
    elif fraction.numerator == 0:
        return "\\frac{0}{1}"
    else:
        return f"\\frac{{{fraction.numerator}}}{{{fraction.denominator}}}"

def fraction_equation_division(difficulty: int):
    """
    Returns data needed for a fraction division question with answers
    Args:
        difficulty (int): difficulty level, ignored for now
    Returns:
        dict: 
            subject: string = kvantitativ
            category: string = basics
            question: string (Latex) = the question
            answers: list of strings (Latex) = the answers
            correct_answer: string = the correct answer
            drawing: list of lists = drawing if needed
            explanation: string (Latex) = the explanation
    """

    from fractions import Fraction
    import random as rd
    from api.v1.core.services.wrong_answer_generator import generate_fraction_choices
    fraction1 = {"numerator": rd.randint(1, 10), "denominator": rd.randint(1, 10)}
    fraction2 = {"numerator": rd.randint(1, 10), "denominator": rd.randint(1, 10)}
    
    frac1 = Fraction(fraction1["numerator"], fraction1["denominator"])
    frac2 = Fraction(fraction2["numerator"], fraction2["denominator"])
    
    # Compute the answer
    result = frac1 / frac2
    
    # Prepare the question and answer
    expression = [fraction1, "/", fraction2]
    correct_answer = format_fraction_answer(result)
    
    # Generate answers
    answers = generate_fraction_choices(expression, result)
    
    # Always use the stacked fraction format for consistent display
    question_format = "\\frac{\\frac{" + str(fraction1['numerator']) + "}{" + str(fraction1['denominator']) + "}}{\\frac{" + str(fraction2['numerator']) + "}{" + str(fraction2['denominator']) + "}}"
    
    return {
        "subject": "kvantitativ",
        "category": "basics_fractions",
        "question": question_format,
        "answers": answers,
        "correct_answer": correct_answer,
        "drawing": [],
        "explanation": explanation_division()
    }

def fraction_equation_multiplication(difficulty: int):
    """
    Returns data needed for a fraction multiplication question with answers
    Args:
        difficulty (int): difficulty level, ignored for now
    Returns:
        dict: 
            subject: string = kvantitativ
            category: string = basics
            question: string (Latex) = the question
            answers: list of strings (Latex) = the answers
            correct_answer: string = the correct answer
            drawing: list of lists = drawing if needed
            explanation: string (Latex) = the explanation
    """

    from fractions import Fraction
    import random as rd
    from api.v1.core.services.wrong_answer_generator import generate_fraction_choices
    fraction1 = {"numerator": rd.randint(1, 10), "denominator": rd.randint(1, 10)}
    fraction2 = {"numerator": rd.randint(1, 10), "denominator": rd.randint(1, 10)}
    
    frac1 = Fraction(fraction1["numerator"], fraction1["denominator"])
    frac2 = Fraction(fraction2["numerator"], fraction2["denominator"])
    
    # Compute the answer
    result = frac1 * frac2
    
    # Prepare the question and answer
    expression = [fraction1, "*", fraction2]
    correct_answer = format_fraction_answer(result)
    
    # Generate answers
    answers = generate_fraction_choices(expression, result)
    
    return {
        "subject": "kvantitativ",
        "category": "basics_fractions",
        "question": f"\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}} \\cdot \\frac{{{fraction2['numerator']}}}{{{fraction2['denominator']}}}",
        "answers": answers,
        "correct_answer": correct_answer,
        "drawing": [],
        "explanation": explanation_multiplication()
    }

def fraction_equation_addition(difficulty: int):
    """
    Returns data needed for a fraction addition question with answers
    Args:
        difficulty (int): difficulty level, ignored for now
    Returns:
        dict: 
            subject: string = kvantitativ
            category: string = basics
            question: string (Latex) = the question
            answers: list of strings (Latex) = the answers
            correct_answer: string = the correct answer
            drawing: list of lists = drawing if needed
            explanation: string (Latex) = the explanation
    """

    from fractions import Fraction
    import random as rd
    from api.v1.core.services.wrong_answer_generator import generate_fraction_choices
    fraction1 = {"numerator": rd.randint(1, 10), "denominator": rd.randint(1, 10)}
    fraction2 = {"numerator": rd.randint(1, 10), "denominator": rd.randint(1, 10)}
    
    while fraction1["denominator"] == fraction2["denominator"]:
        fraction2["denominator"] = rd.randint(1, 10)
    
    frac1 = Fraction(fraction1["numerator"], fraction1["denominator"])
    frac2 = Fraction(fraction2["numerator"], fraction2["denominator"])
    
    # Compute the answer
    result = frac1 + frac2
    
    # Prepare the question and answer
    expression = [fraction1, "+", fraction2]
    correct_answer = format_fraction_answer(result)
    
    # Generate answers
    answers = generate_fraction_choices(expression, result)
    
    return {
        "subject": "kvantitativ",
        "category": "basics_fractions",
        "question": f"\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}} + \\frac{{{fraction2['numerator']}}}{{{fraction2['denominator']}}}",
        "answers": answers,
        "correct_answer": correct_answer,
        "drawing": [],
        "explanation": explanation_addition()
    }

def fraction_equation_subtraction(difficulty: int):
    """
    Returns data needed for a fraction subtraction question with answers
    Args:
        difficulty (int): difficulty level, ignored for now
    Returns:
        dict: 
            subject: string = kvantitativ
            category: string = basics
            question: string (Latex) = the question
            answers: list of strings (Latex) = the answers
            correct_answer: string = the correct answer
            drawing: list of lists = drawing if needed
            explanation: string (Latex) = the explanation
    """

    from fractions import Fraction
    import random as rd
    from api.v1.core.services.wrong_answer_generator import generate_fraction_choices
    fraction1 = {"numerator": rd.randint(1, 10), "denominator": rd.randint(1, 10)}
    fraction2 = {"numerator": rd.randint(1, 10), "denominator": rd.randint(1, 10)}
    
    while fraction1["denominator"] == fraction2["denominator"]:
        fraction2["denominator"] = rd.randint(1, 10)
    
    frac1 = Fraction(fraction1["numerator"], fraction1["denominator"])
    frac2 = Fraction(fraction2["numerator"], fraction2["denominator"])
    
    # Compute the answer
    result = frac1 - frac2
    
    # Prepare the question and answer
    expression = [fraction1, "-", fraction2]
    correct_answer = format_fraction_answer(result)
    
    # Generate answers
    answers = generate_fraction_choices(expression, result)
    
    return {
        "subject": "kvantitativ",
        "category": "basics_fractions",
        "question": f"\\frac{{{fraction1['numerator']}}}{{{fraction1['denominator']}}} - \\frac{{{fraction2['numerator']}}}{{{fraction2['denominator']}}}",
        "answers": answers,
        "correct_answer": correct_answer,
        "drawing": [],
        "explanation": explanation_subtraction()
    }

def fraction_shortening(difficulty: int):
    """
    Returns data needed for a fraction shortening question with answers
    Args:
        difficulty (int): difficulty level, ignored for now
    Returns:
        dict: 
            subject: string = kvantitativ
            category: string = basics
            question: string (Latex) = the question
            answers: list of strings (Latex) = the answers
            correct_answer: string = the correct answer
            drawing: list of lists = drawing if needed
            explanation: string (Latex) = the explanation
    """

    import random as rd
    import math
    from fractions import Fraction
    from api.v1.core.services.wrong_answer_generator import generate_fraction_shortening_choices
    from api.v1.core.services.equation_generator import fraction_shortened
    
    # Generate an unsimplified fraction
    # We need a fraction where gcd(numerator, denominator) > 1
    while True:
        base_num = rd.randint(2, 6)  # Base for multiplication
        num_factor = rd.randint(1, 5)  # Factor for numerator
        den_factor = rd.randint(1, 5)  # Factor for denominator
        
        numerator = base_num * num_factor
        denominator = base_num * den_factor
        
        if numerator != denominator and math.gcd(numerator, denominator) > 1:
            break
    
    fraction1 = {"numerator": numerator, "denominator": denominator}
    
    # Compute the simplified fraction
    simplified = fraction_shortened(numerator=numerator, denominator=denominator)
    result = Fraction(simplified["numerator"], simplified["denominator"])
    
    # Format the correct answer
    correct_answer = format_fraction_answer(result)
    
    # Generate wrong answers
    question_data = {
        "subject": "kvantitativ",
        "category": "basics_fractions",
        "question": f"Förkorta bråket \\frac{{{numerator}}}{{{denominator}}}",
        "correct_answer": correct_answer,
        "drawing": [],
        "explanation": explanation_shortening()
    }
    
    question_data["answers"] = generate_fraction_shortening_choices(
        fraction1, result)
    
    return question_data

def fraction_expanding(difficulty: int):
    """
    Returns data needed for a fraction expanding question with answers
    Args:
        difficulty (int): difficulty level, ignored for now
    Returns:
        dict: 
            subject: string = kvantitativ
            category: string = basics
            question: string (Latex) = the question
            answers: list of strings (Latex) = the answers
            correct_answer: string = the correct answer
            drawing: list of lists = drawing if needed
            explanation: string (Latex) = the explanation
    """

    import random as rd
    from fractions import Fraction
    from api.v1.core.services.equation_generator import fraction_shortened
    
    # Generate a simplified fraction
    numerator = rd.randint(1, 10)
    denominator = rd.randint(1, 10)
    
    # Make sure numerator and denominator are coprime
    simplified = fraction_shortened(numerator=numerator, denominator=denominator)
    numerator = simplified["numerator"]
    denominator = simplified["denominator"]
    
    # Choose a factor to expand by
    expand_factor = rd.randint(2, 5)
    
    # Create the original and expanded fractions
    original_fraction = Fraction(numerator, denominator)
    expanded_numerator = numerator * expand_factor
    expanded_denominator = denominator * expand_factor
    
    # Format the correct answer
    correct_answer = format_fraction_answer(Fraction(expanded_numerator, expanded_denominator))
    
    # Generate wrong answers
    wrong_answers = []
    
    # Common mistake 1: Add the factor instead of multiplying
    wrong_answers.append(format_fraction_answer(Fraction(numerator + expand_factor, denominator + expand_factor)))
    
    # Common mistake 2: Multiply numerator only
    wrong_answers.append(format_fraction_answer(Fraction(numerator * expand_factor, denominator)))
    
    # Common mistake 3: Multiply denominator only
    wrong_answers.append(format_fraction_answer(Fraction(numerator, denominator * expand_factor)))
    
    # Add more wrong answers if needed to get 3 total
    while len(wrong_answers) < 3:
        random_numerator = rd.randint(1, 20)
        random_denominator = rd.randint(1, 20)
        random_answer = format_fraction_answer(Fraction(random_numerator, random_denominator))
        if random_answer not in wrong_answers and random_answer != correct_answer:
            wrong_answers.append(random_answer)
    
    # Combine correct and wrong answers, then shuffle
    all_answers = wrong_answers + [correct_answer]
    rd.shuffle(all_answers)
    
    return {
        "subject": "kvantitativ",
        "category": "basics_fractions",
        "question": f"Utvidga bråket \\frac{{{numerator}}}{{{denominator}}} med {expand_factor}",
        "answers": all_answers,
        "correct_answer": correct_answer,
        "drawing": [],
        "explanation": explanation_expanding()
    }

# Explanation functions
def explanation_addition():
    """Return the explanation for fraction addition."""
    return "FractionAddition.mp4"

def explanation_subtraction():
    """Return the explanation for fraction subtraction."""
    return "FractionSubtraction.mp4"

def explanation_multiplication():
    """Return the explanation for fraction multiplication."""
    return "FractionMultiplication.mp4"

def explanation_division():
    """Return the explanation for fraction division."""
    return "FractionDivision.mp4"

def explanation_shortening():
    """Return the explanation for fraction shortening."""
    return "FractionShortening.mp4"

def explanation_expanding():
    """Return the explanation for fraction expanding."""
    return "FractionExpanding.mp4"
