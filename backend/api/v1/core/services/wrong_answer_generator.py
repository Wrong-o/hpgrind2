import random
import re
from fractions import Fraction


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
    
    # Original unsimplified fraction
    
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
    correct_answer =str(expression["result"])
    wrong_answers = [] 
    if expression["operator"] == "+":
        wrong_answers.append(expression["int1"] - expression["int2"])
        wrong_answers.append(expression["int2"] - expression["int1"])
        wrong_answers.append(expression["result"] * -1)
    all_answers = [correct_answer] + wrong_answers[:3]
    return all_answers 

