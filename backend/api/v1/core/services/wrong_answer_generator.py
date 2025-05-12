import random
import re
from fractions import Fraction
from api.v1.core.services.equation_generator import fraction_shortened
import math


def generate_math_choices(expression, correct_answer, decimals=0):
    """
    Generate 4 answer all_answers for a math expression, including the correct answer and
    3 wrong answers that result from evaluating the expression with common errors:
    - Ignoring parentheses
    - Applying operations in the wrong order
    - Misinterpreting operator precedence

    Parameters:
    expression (str): A string representing a math expression (e.g., "17 + 53 / 27 - 20" or "(4 + 2) * 3")
    correct_answer (float): The correct result of evaluating the expression

    Returns:
    list: List of 4 answer all_answers (including the correct answer), shuffled
    """
    # Function to safely evaluate a mathematical expression
    def safe_eval(expr):
        try:
            # Replace × and ÷ with * and / for Python evaluation
            expr = expr.replace('×', '*').replace('÷', '/')
            return eval(expr)
        except:
            # Return a slightly modified correct answer if evaluation fails
            return correct_answer * random.uniform(0.9, 1.1)

    wrong_answers = []

    # Error 1: Ignore parentheses by removing them
    if '(' in expression:
        no_parentheses = re.sub(r'[()]', '', expression)
        wrong1 = safe_eval(no_parentheses)
        wrong_answers.append(round(wrong1, decimals))

    # Error 2: Evaluate from left to right, ignoring operator precedence
    if '+' in expression or '-' in expression or '*' in expression or '/' in expression or '×' in expression or '÷' in expression:
        # Convert the expression to a form we can evaluate left-to-right
        tokens = re.findall(r'[\d.]+|[\+\-\*\/×÷()]', expression)
        left_to_right = ""
        current_num = None
        current_op = None

        for token in tokens:
            if re.match(r'[\d.]+', token):
                if current_num is None:
                    current_num = float(token)
                else:
                    if current_op == '+':
                        current_num += float(token)
                    elif current_op == '-':
                        current_num -= float(token)
                    elif current_op in ['*', '×']:
                        current_num *= float(token)
                    elif current_op in ['/', '÷']:
                        if float(token) != 0:
                            current_num /= float(token)
                        else:
                            current_num = float('inf')
                    current_op = None
            elif token in ['+', '-', '*', '/', '×', '÷']:
                current_op = token
            # Ignore parentheses for this calculation

        wrong2 = current_num if current_num is not None else correct_answer * 1.15
        wrong_answers.append(round(wrong2, decimals))

    # Error 3: Apply the wrong precedence to operations
    # This simulates treating addition/subtraction before multiplication/division
    wrong_precedence_expr = expression

    # Handle parentheses first if they exist
    if '(' in wrong_precedence_expr:
        # Extract all expressions in parentheses
        paren_expressions = re.findall(r'\(([^()]+)\)', wrong_precedence_expr)
        for paren_expr in paren_expressions:
            # Evaluate the parenthesized expression correctly
            paren_result = safe_eval(f"({paren_expr})")
            # Replace the parenthesized expression with its result
            wrong_precedence_expr = wrong_precedence_expr.replace(
                f"({paren_expr})", str(paren_result))

    # Now evaluate with incorrect precedence (+ and - before * and /)
    tokens = re.findall(r'[\d.]+|[\+\-\*\/×÷]', wrong_precedence_expr)

    # First pass: do addition and subtraction
    i = 1
    while i < len(tokens):
        if tokens[i] in ['+', '-']:
            left = float(tokens[i-1])
            right = float(tokens[i+1])
            if tokens[i] == '+':
                result = left + right
            else:  # '-'
                result = left - right
            tokens[i-1] = str(result)
            tokens.pop(i)
            tokens.pop(i)
        else:
            i += 2

    # Second pass: do multiplication and division
    i = 1
    while i < len(tokens):
        if tokens[i] in ['*', '/', '×', '÷']:
            left = float(tokens[i-1])
            right = float(tokens[i+1])
            if tokens[i] in ['*', '×']:
                result = left * right
            else:  # '/' or '÷'
                if right != 0:
                    result = left / right
                else:
                    result = float('inf')
            tokens[i-1] = str(result)
            tokens.pop(i)
            tokens.pop(i)
        else:
            i += 2

    wrong3 = float(tokens[0]) if tokens else correct_answer * 0.85
    wrong_answers.append(round(wrong3, decimals))

    # Generate additional wrong answers if needed
    while len(wrong_answers) < 3:
        # Create a random modification of the correct answer
        wrong = correct_answer * random.uniform(0.7, 1.3)
        if abs(wrong - correct_answer) > 0.1 * abs(correct_answer):  # Ensure it's different enough
            wrong_answers.append(round(wrong, decimals))

    # Ensure all answers are unique and different from the correct answer
    unique_wrong = []
    for wrong in wrong_answers:
        if wrong != round(correct_answer, decimals) and wrong not in unique_wrong:
            unique_wrong.append(wrong)

    # If we lost some answers due to duplicates, add more
    while len(unique_wrong) < 3:
        wrong = correct_answer * random.uniform(0.7, 1.3)
        rounded = round(wrong, decimals)
        if rounded != round(correct_answer, decimals) and rounded not in unique_wrong:
            unique_wrong.append(rounded)

    # Combine all answers and shuffle
    all_answers = [round(correct_answer, decimals)] + unique_wrong[:3]
    random.shuffle(all_answers)

    return all_answers


def generate_fraction_choices(expression, correct_answer, decimals=0):
    """
    Generate 4 answer all_answers for a math expression, including the correct answer and
    3 wrong answers that result from evaluating the expression with common errors:
    - Applying operations in the wrong order
    - Incorrect simplification
    - Treating fractions as integers
    - Incorrect inversion during division

    expression (list): A list of dict with 2 fractions and an operator, e.g {'numerator': 9, 'denominator': 4} / {'numerator': 4, 'denominator': 6}
    correct_answer (float): The correct result of evaluating the expression

    Returns:
    list: List of 4 answer all_answers (including the correct answer), shuffled
    """
    # Parse the expression
    frac1 = Fraction(expression[0]['numerator'],
                     expression[0]['denominator'])
    print(correct_answer)
    operator = expression[1]
    frac2 = Fraction(expression[2]['numerator'],
                     expression[2]['denominator'])
    # Generate wrong answers based on common errors
    wrong_answers = []
# Wrong order of operations
    if operator == '+':
        wrong_answers.append(frac1 * frac2)
    elif operator == '-':
        wrong_answers.append(frac1 * frac2)
    elif operator == '*':
        wrong_answers.append(frac1 + frac2)
    elif operator == '/':
        wrong_answers.append(frac1 + frac2)

    # Incorrect simplification
    if operator == '+':
        wrong_answers.append(frac1 + frac2 + Fraction(1, 10))
    elif operator == '-':
        wrong_answers.append(frac1 - frac2 - Fraction(1, 10))
    elif operator == '*':
        wrong_answers.append(frac1 * frac2 + Fraction(1, 10))
    elif operator == '/':
        wrong_answers.append(frac1 / frac2 - Fraction(1, 10))

    # Treating fractions as integers
    int_frac1 = frac1.numerator // frac1.denominator
    int_frac2 = frac2.numerator // frac2.denominator
    if operator == '+':
        wrong_answers.append(Fraction(int_frac1 + int_frac2))
    elif operator == '-':
        wrong_answers.append(Fraction(int_frac1 - int_frac2))
    elif operator == '*':
        wrong_answers.append(Fraction(int_frac1 * int_frac2))
    elif operator == '/':
        wrong_answers.append(Fraction(int_frac1, int_frac2)
                             if int_frac2 != 0 else Fraction(0))

    # Incorrect inversion during division
    if operator == '/':
        wrong_answers.append(frac1 * frac2)

    # Ensure all wrong answers are unique and convert to LaTeX fraction form
    wrong_answers = list(set(wrong_answers))
    wrong_answers = [
        f"\\frac{{{answer.numerator}}}{{{answer.denominator}}}" for answer in wrong_answers]

    # Add the correct answer in LaTeX fraction form and shuffle
    all_answers = [correct_answer] + wrong_answers[:3]
    random.shuffle(all_answers)

    return all_answers

def generate_fraction_shortening_choices(expression, correct_answer, decimals=0):
    """
    Returns 4 answers, correct included
    Possible error sources are:
    - Not shortening at all (original fraction)
    - Multiplying both numbers by 2 (equivalent but unsimplified)
    - Adding 1 to numerator (different fraction)
    - Subtracting 1 from denominator (different fraction)
    """ 
    fraction = Fraction(expression['numerator'],
                     expression['denominator'])
    wrong_answers = []
    
    
    # Multiplied by 2 (unsimplified)
    wrong_answers.append(Fraction(fraction.numerator * 2, fraction.denominator * 2))
    
    # Slightly modified fractions that are actually different
    wrong_answers.append(Fraction(fraction.numerator + 1, fraction.denominator))
    if fraction.denominator > 1:
        wrong_answers.append(Fraction(fraction.numerator, fraction.denominator - 1))
    else:
        wrong_answers.append(Fraction(fraction.numerator, fraction.denominator + 1))
    
    # Ensure all wrong answers are unique and convert to LaTeX fraction form
    wrong_answers = list(set(wrong_answers))
    wrong_answers = [
        f"\\frac{{{answer.numerator}}}{{{answer.denominator}}}" for answer in wrong_answers]

    # Add the correct answer in LaTeX fraction form and shuffle
    all_answers = [correct_answer] + wrong_answers[:3]
    random.shuffle(all_answers)

    return all_answers 

def generate_x_equation_choices(expression):
    """
    Generates choices to  x_equations
    Args:
        dict: expression = 
            int1: int,
            int2: int,
            operator: chr,
            result: int
         """ 
    correct_answer = str(expression["result"])
    wrong_answers = set() 
    if expression["operator"] == "+":
        wrong_answers.add(expression["int1"] - expression["int2"])
        wrong_answers.add(expression["int2"] - expression["int1"])
        wrong_answers.add(expression["result"] * -1)
        all_answers = [correct_answer] + list(wrong_answers)[:3]

    elif expression["operator"] == "-":
        wrong_answers.add(expression["int1"] + expression["int2"])
        wrong_answers.add(expression["int2"] + expression["int1"])
        wrong_answers.add(expression["result"] * -1)
        all_answers = [correct_answer] + list(wrong_answers)[:3]
        
    elif expression["operator"] == "*":
        # Generate distinct wrong answers for multiplication
        wrong_answers.add(expression["result"] + expression["int2"])  # Adding instead of multiplying
        wrong_answers.add(expression["result"] + expression["int1"])  
        wrong_answers.add(expression["result"] * expression["int2"] + 1)
        if len(wrong_answers) <3:
            wrong_answers.add(expression["result"] * expression["int2"] - 1)
        all_answers = [correct_answer] + list(round(answer, 2) for answer in wrong_answers)[:3]
        
    elif expression["operator"] == "/":
        # Generate distinct wrong answers for division
        wrong_answers.add(expression["int1"] * expression["int2"])  # Multiplying instead of dividing
        wrong_answers.add(expression["result"] + expression["int2"])  # Adding divisor to result
        wrong_answers.add(expression["result"] / expression["int2"] + 1)
        if len(wrong_answers) <3:
            wrong_answers.add(expression["result"] * -1)  # Negative of correct result
        all_answers = [correct_answer] + list(round(answer, 2) for answer in wrong_answers)[:3]

    random.shuffle(all_answers)
    return all_answers

def generate_mean_choices(sequence):
    """
    Generates choices to mean questions
    Args:
        sequence: dict with sequence: list of int, mean: int
    """
    mean = sequence["mean"]
    sequence = sequence["sequence"]
    wrong_answers = set()
    sorted_seq = sorted(sequence)
    middle_idx = len(sorted_seq) // 2
    if len(sorted_seq) % 2 == 0:
        wrong_answers.add(sorted_seq[middle_idx-1])
        wrong_answers.add(sorted_seq[middle_idx]) 
    else:
        wrong_answers.add(sorted_seq[middle_idx-1])
        wrong_answers.add(sorted_seq[middle_idx+1])
    wrong_answers_list = list(wrong_answers)
    wrong_answers.add(wrong_answers_list[0] + 1)
    wrong_answers.add(wrong_answers_list[1] - 1)
    if len(wrong_answers) < 3:
        wrong_answers_list = list(wrong_answers)
        wrong_answers.add(wrong_answers_list[0] - 1)
        wrong_answers.add(wrong_answers_list[1] + 1)
    answers = [mean] + list(wrong_answers)[:3]
    random.shuffle(answers)
    return answers

##DU ÄR HÄR: Ändra felsvaren, det blir bara 3
##
def generate_median_choices(sequence):
    """
    Generates choices to median questions
    Args:
        sequence: dict with sequence: list of int, median: int
    """
    median = sequence["median"]
    sequence = sequence["sequence"]
    wrong_answers = set()
    sorted_seq = sorted(sequence)
    middle_idx = len(sorted_seq) // 2
    if len(sorted_seq) % 2 == 0:
        wrong_answers.add(sorted_seq[middle_idx-1])
        wrong_answers.add(sorted_seq[middle_idx+1])
        wrong_answers.add(sorted_seq[middle_idx-2])
        wrong_answers.add(sorted_seq[middle_idx]+1)
    else:
        wrong_answers.add(sorted_seq[middle_idx-1])
        wrong_answers.add(sorted_seq[middle_idx+1])
        wrong_answers.add(sorted_seq[middle_idx-2])
        wrong_answers.add(sorted_seq[middle_idx]+1)
    answers = [median] + list(wrong_answers)[:3]
    random.shuffle(answers)
    return answers

def generate_mode_choices(sequence):
    """
    Generates choices to mode questions
    Args:
        sequence: dict with sequence: list of int, median: int
    """
    mode = sequence["mode"]
    sequence = sequence["sequence"]
    wrong_answers = set()
    for i in range(len(sequence)):
        if sequence[i] == mode:
            continue
        else:
            wrong_answers.add(sequence[i])
    answers = [mode] + list(wrong_answers)[:3]
    random.shuffle(answers)
    return answers

def generate_linear_equation_choices(equation):
    """
    Generates choices to linear equation questions
    Args:
        equation: dict with equation: str, solution: int
    """
### DU ÄR HÄR
    wrong_answers = set()
    wrong_answers.add(equation["solution"] + 1)
    wrong_answers.add(equation["solution"] - 1)
    wrong_answers.add(equation["solution"] + 2)
    wrong_answers.add(equation["solution"] - 2)
    answers = [equation["solution"]] + list(wrong_answers)[:3]
    random.shuffle(answers)
    return answers

def generate_probability_choices(groups):
    """
    Generates choices to probability questions
    first group is correct answer
    Args:
        groups: list of int
        correct_answer: int 
    """
    n = sum(groups)
    answers = set()
    for i in range(len(groups)):
        shortened = fraction_shortened(numerator=groups[i], denominator=n)
        answers.add(f"\\frac{{{shortened['numerator']}}}{{{shortened['denominator']}}}")
        answers.add(f"\\frac{{{shortened['denominator']}}}{{{shortened['numerator']}}}")
    if len(answers) < 4:
        answers.add(f"\\frac{{{0}}}{{{1}}}")
        answers.add(f"\\frac{{{1}}}{{{1}}}")
    answers = list(answers)[:4]
    random.shuffle(answers)
    return answers

def generate_probability_combination_with_replacement_choices(groups):
    """
    Generates choices to probability combination with replacement questions
    first group is correct answer
    Args:
        groups: list of int
    """
    n = sum(groups)
    answers = set()
    
    alternative = fraction_shortened(numerator=groups[0]**2, denominator=n**2)
    answers.add(f"\\frac{{{alternative['numerator']}}}{{{alternative['denominator']}}}")
    
    alternative = fraction_shortened(numerator=groups[1]**2, denominator=n**2)
    answers.add(f"\\frac{{{alternative['numerator']}}}{{{alternative['denominator']}}}")
    
    alternative = fraction_shortened(numerator=n**2, denominator=groups[0]**2)
    answers.add(f"\\frac{{{alternative['numerator']}}}{{{alternative['denominator']}}}")
    
    alternative = fraction_shortened(numerator=n**2, denominator=groups[1]**2)
    answers.add(f"\\frac{{{alternative['numerator']}}}{{{alternative['denominator']}}}")
    
    if len(answers) < 4:
        answers.add(f"\\frac{{{0}}}{{{1}}}")
        answers.add(f"\\frac{{{1}}}{{{1}}}")
    answers = list(answers)[:4]
    random.shuffle(answers)
    return answers

def generate_probability_combination_without_replacement_choices(groups):
    """
    Generates choices to probability combination without replacement questions
    first group is correct answer
    Args:
        groups: list of int 
    """
    n = sum(groups)
    answers = set()

    # Calculate first answer with GCD
    num1 = groups[0] * (groups[0] - 1)
    den1 = n * (n - 1)
    gcd1 = math.gcd(num1, den1)
    answers.add(f"\\frac{{{num1 // gcd1}}}{{{den1 // gcd1}}}")

    # Calculate second answer with GCD
    num2 = groups[1] * (groups[1] - 1) 
    den2 = n * (n - 1)
    gcd2 = math.gcd(num2, den2)
    answers.add(f"\\frac{{{num2 // gcd2}}}{{{den2 // gcd2}}}")

    # Calculate third answer with GCD (using groups[0])
    num3 = groups[0] * groups[1]  # Changed from groups[0] * groups[0]
    den3 = n * (n - 1)  # Changed from n * n
    gcd3 = math.gcd(num3, den3)
    answers.add(f"\\frac{{{num3 // gcd3}}}{{{den3 // gcd3}}}")

    # Calculate fourth answer (inverse of correct answer)
    num4 = den1 // gcd1
    den4 = num1 // gcd1
    answers.add(f"\\frac{{{num4}}}{{{den4}}}")

    answers = list(answers)
    random.shuffle(answers)
    return answers

def percentage_whole_number_wrong_answers(base_number, percentage):
    """
    Generates wrong answers for percentage whole number questions
    Args:
        base_number: int
        percentage: int
    """
    wrong_answers = set()
    wrong_answers.add(int(base_number * percentage / 100))
    wrong_answers.add(int(base_number * percentage / 100) - 1)
    wrong_answers.add(int(base_number * percentage / 100) + 1)
    wrong_answers.add(int(base_number * percentage / 100) - 2)
    wrong_answers.add(int(base_number * percentage / 100) + 2)
    return list(wrong_answers)[:4]

def percentage_change_wrong_answers(base_number, percentage):
    """
    Generates wrong answers for percentage change questions
    Args:
        base_number: int
        percentage: int
    """
    wrong_answers = set()

    wrong_answers.add(percentage)
    wrong_answers.add(percentage + 10)
    wrong_answers.add(percentage - 10)
    wrong_answers.add(percentage + 20)
    return list(wrong_answers)[:4]

def percentage_interest_wrong_answers(base_number, interest_rate, time_period):
    """
    Generates wrong answers for percentage interest questions
    Args:
        base_number: int
        interest_rate: int
        time_period: int
    """
    print(base_number, interest_rate, time_period)
    wrong_answers = set()
    wrong_answers.add(base_number * (1 + interest_rate / 100) ** time_period)
    wrong_answers.add(base_number * (1 + interest_rate / 100) ** time_period)
    wrong_answers.add(base_number * (1 + interest_rate / 100) ** (time_period - 1))
    wrong_answers.add(base_number * (1 + interest_rate / 100) ** (time_period + 1))
    return list(wrong_answers)[:4]