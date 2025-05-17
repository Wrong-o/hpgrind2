import random
import re
from fractions import Fraction
from api.v1.core.services.equation_generator import fraction_shortened, format_fraction_latex
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

    try:
        wrong3 = float(tokens[0]) if tokens else correct_answer * 0.85
    except (ValueError, TypeError):
        wrong3 = correct_answer * 0.85
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


def generate_fraction_choices(expression, correct_answer_frac: Fraction, decimals=0):
    """
    Generate 4 answer choices for a math expression involving fractions.
    The correct_answer_frac is a Fraction object.
    Returns a list of 4 unique LaTeX strings.
    """
    frac1_dict = expression[0]
    operator = expression[1]
    frac2_dict = expression[2]

    frac1 = Fraction(frac1_dict['numerator'], frac1_dict['denominator'])
    frac2 = Fraction(frac2_dict['numerator'], frac2_dict['denominator'])

    # Generate potential wrong answers as Fraction objects based on common errors
    potential_wrong_fractions = []

    # Error type 1: Incorrect operation
    if operator == '+':
        potential_wrong_fractions.append(frac1 * frac2) # Multiply instead of add
        if frac1.denominator != 0 and frac2.denominator != 0 and (frac1.denominator + frac2.denominator != 0):
             potential_wrong_fractions.append(Fraction(frac1.numerator + frac2.numerator, frac1.denominator + frac2.denominator))
    elif operator == '-':
        if frac2 != 0: potential_wrong_fractions.append(frac1 / frac2) # Divide instead of subtract
        if frac1.denominator != 0 and frac2.denominator != 0 and (frac1.denominator - frac2.denominator != 0 if frac1.denominator != frac2.denominator else True): # Avoid 0 den
            if frac1.denominator == frac2.denominator and frac1.denominator - frac2.denominator == 0: # handle same den
                 potential_wrong_fractions.append(Fraction(frac1.numerator - frac2.numerator, frac1.denominator + 1))
            elif frac1.denominator != frac2.denominator:
                 potential_wrong_fractions.append(Fraction(frac1.numerator - frac2.numerator, frac1.denominator - frac2.denominator))


    elif operator == '*':
        potential_wrong_fractions.append(frac1 + frac2) # Add instead of multiply
    elif operator == '/':
        if frac2 != 0:
            potential_wrong_fractions.append(frac1 * frac2) # Common inversion error (forgetting to invert or inverting wrong part)
            potential_wrong_fractions.append(frac1 * Fraction(frac2.denominator, frac2.numerator * 2 if frac2.numerator != 0 else 1)) # Incorrect inversion of one part

    # Error type 2: Using integer parts of fractions
    # int_frac1 = frac1.numerator // frac1.denominator if frac1.denominator != 0 else frac1.numerator
    # int_frac2 = frac2.numerator // frac2.denominator if frac2.denominator != 0 else frac2.numerator
    # if operator == '+': potential_wrong_fractions.append(Fraction(int_frac1 + int_frac2))
    # elif operator == '-': potential_wrong_fractions.append(Fraction(int_frac1 - int_frac2))

    # Error type 3: Slightly off from correct answer
    if correct_answer_frac.denominator != 0:
        potential_wrong_fractions.append(correct_answer_frac + Fraction(1, correct_answer_frac.denominator + random.randint(1,3)))
        if correct_answer_frac.numerator != 0: # Ensure subtraction doesn't lead to zero if original isn't zero unless it's a small number
            potential_wrong_fractions.append(correct_answer_frac - Fraction(1, correct_answer_frac.denominator + random.randint(1,3)))


    # Filter out duplicates and any that are identical to the correct answer
    distinct_wrong_fractions_set = set()
    for wf in potential_wrong_fractions:
        if wf != correct_answer_frac:
            distinct_wrong_fractions_set.add(wf)
    
    distinct_wrong_fractions_list = list(distinct_wrong_fractions_set)

    # Format the correct answer (Fraction object) to LaTeX string
    correct_answer_latex = format_fraction_latex(correct_answer_frac)

    # Format the distinct wrong fractions to LaTeX strings
    wrong_answers_latex = [format_fraction_latex(f) for f in distinct_wrong_fractions_list]

    # Combine correct answer with up to 3 distinct wrong answers
    all_answers_latex_set = {correct_answer_latex} # Use a set to ensure uniqueness of final LaTeX strings
    for wa_latex in wrong_answers_latex:
        if len(all_answers_latex_set) < 4: # Need 1 correct + 3 wrong
            all_answers_latex_set.add(wa_latex)
        else:
            break
            
    # Pad if we don't have 4 unique LaTeX strings yet
    padding_idx = 1
    common_denominators_for_padding = [d for d in range(2,11)] # Denominators from 2 to 10
    random.shuffle(common_denominators_for_padding)

    while len(all_answers_latex_set) < 4:
        # Generate a new random fraction for padding
        # Make it somewhat related to the correct answer's complexity or just simple
        num = random.randint(1,5) + correct_answer_frac.numerator % 5 + padding_idx
        den = common_denominators_for_padding[padding_idx % len(common_denominators_for_padding)]
        
        # Avoid generating a fraction that simplifies to the correct answer or existing options easily
        # This is tricky; for now, just generate and check uniqueness of LaTeX string
        padding_fraction = Fraction(num, den)
        
        padding_latex = format_fraction_latex(padding_fraction)
        
        if padding_latex not in all_answers_latex_set:
            all_answers_latex_set.add(padding_latex)
        
        padding_idx += 1
        if padding_idx > 20: # Safety break to prevent infinite loops
            # Fallback: add very simple, potentially less distinct items if padding is problematic
            while len(all_answers_latex_set) < 4:
                fallback_latex = format_fraction_latex(Fraction(padding_idx + random.randint(1,3), padding_idx + random.randint(4,7)))
                all_answers_latex_set.add(fallback_latex) # Set handles uniqueness
            break

    final_choices = list(all_answers_latex_set)[:4] # Ensure exactly 4 choices if set grew larger
    # If by some chance it's still less than 4 after the loop (e.g. safety break with non-unique fallback)
    while len(final_choices) < 4:
        final_choices.append(format_fraction_latex(Fraction(random.randint(11,20), random.randint(11,20)+len(final_choices))))
        final_choices = list(set(final_choices)) # ensure unique again

    random.shuffle(final_choices)
    return final_choices

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
    wrong_answers = set()
    wrong_answers.add(Fraction(fraction.numerator, fraction.denominator))
    wrong_answers.add(Fraction(fraction.numerator, fraction.denominator * 2))
    
    # Slightly modified fractions that are actually different
    wrong_answers.add(Fraction(fraction.numerator + 1, fraction.denominator))
    if fraction.denominator > 1:
        wrong_answers.add(Fraction(fraction.numerator, fraction.denominator - 1))
    else:
        wrong_answers.add(Fraction(fraction.numerator, fraction.denominator + 1))
    if len(wrong_answers) < 4:
        wrong_answers.add(Fraction(1, 1))
    wrong_answers = [
        f"\\frac{{{answer.numerator}}}{{{answer.denominator}}}" for answer in wrong_answers]

    # Add the correct answer and shuffle
    all_answers = wrong_answers[:4]
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
        if len(wrong_answers) < 3:
            wrong_answers.add(1)
        all_answers = [correct_answer] + list(wrong_answers)[:3]

    elif expression["operator"] == "-":
        wrong_answers.add(expression["int1"] + expression["int2"])
        wrong_answers.add(expression["int2"] + expression["int1"])
        wrong_answers.add(expression["result"] * -1)
        if len(wrong_answers) < 3:
            wrong_answers.add(1)
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
    wrong_answers = set([mean])
    sorted_seq = sorted(sequence)
    middle_idx = len(sorted_seq) // 2
    if len(sorted_seq) % 2 == 0:
        wrong_answers.add(sorted_seq[middle_idx-1])
        wrong_answers.add(sorted_seq[middle_idx]) 
    else:
        wrong_answers.add(sorted_seq[middle_idx-1])
        wrong_answers.add(sorted_seq[middle_idx+1])
    if len(wrong_answers) < 4:
        wrong_answers.add(mean - 1)
        wrong_answers.add(mean + 1)
        wrong_answers.add(mean - 2)
        wrong_answers.add(mean + 2)
    answers = list(wrong_answers)[:4]
    random.shuffle(answers)
    return answers

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
    answers.add(f"\\frac{{{num1 // gcd1}}}{{{den1}}}")
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

    answers.add(f"\\frac{{{groups[0]}}}{{{groups[1]}}}")

    answers = list(answers)[:4]

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

    wrong_answers.add(str(percentage) + "%")
    wrong_answers.add(str(percentage + 10) + "%")
    wrong_answers.add(str(percentage - 10) + "%")
    wrong_answers.add(str(percentage + 20) + "%")
    return list(wrong_answers)[:4]

def percentage_interest_wrong_answers(base_number, interest_rate_percent, time_period, correct_simple_interest):
    """
    Generates wrong answers for simple percentage interest questions.
    The choices returned will be interest amounts as strings.

    Args:
        base_number: int
        interest_rate_percent: int (e.g., 50 for 50%)
        time_period: int
        correct_simple_interest: float or int (this is P * (rate/100) * t)
    """
    wrong_answers_numeric = set()

    # Distractor 1: Compound interest amount for the same period
    # A = P * (1 + r/100)^t
    # Compound Interest = A - P
    if time_period > 0 : # Compound interest makes sense if there is a time period
        total_compound_amount = base_number * (1 + interest_rate_percent / 100) ** time_period
        compound_interest = total_compound_amount - base_number
        if compound_interest != correct_simple_interest:
            wrong_answers_numeric.add(compound_interest)

    # Distractor 2: Simple interest for only one year
    one_year_simple_interest = base_number * (interest_rate_percent / 100) * 1
    if one_year_simple_interest != correct_simple_interest:
        wrong_answers_numeric.add(one_year_simple_interest)
    
    # Distractor 3: The principal amount itself
    if base_number != correct_simple_interest:
        wrong_answers_numeric.add(base_number)
        
    # Distractor 4: Total amount (Principal + Simple Interest)
    total_simple_amount = base_number + correct_simple_interest
    # This is a distractor *if* the question specifically asks for *interest*
    # and not total. We add it because users might calculate total.
    wrong_answers_numeric.add(total_simple_amount)

    # Distractor 5: Interest rate percentage itself (as a number)
    if interest_rate_percent != correct_simple_interest:
        wrong_answers_numeric.add(interest_rate_percent)

    # Process to ensure numeric and distinct from correct_simple_interest
    # Round floats to 2 decimal places or convert to int if they are whole numbers
    processed_wrong_answers = set()
    for ans in wrong_answers_numeric:
        if ans == correct_simple_interest: # Skip if it accidentally equals the correct answer
            continue
        if isinstance(ans, float):
            processed_wrong_answers.add(int(ans) if ans.is_integer() else round(ans, 2))
        else: # ans is int
            processed_wrong_answers.add(ans)
            
    final_wrong_for_choices = list(processed_wrong_answers)
    random.shuffle(final_wrong_for_choices) # Shuffle to pick diverse wrong answers if many were generated
    final_wrong_for_choices = final_wrong_for_choices[:3] # Take up to 3 distinct wrong answers
    
    # Fill up with more variations if we don't have enough distinct wrong answers
    idx = 1
    temp_additional_wrong = set(final_wrong_for_choices)
    
    while len(temp_additional_wrong) < 3:
        # Variation: slight arithmetic error
        variation_add = correct_simple_interest + (idx * (base_number * 0.05) if base_number > 0 else idx) # Add/subtract 5% of base or just idx
        variation_sub = correct_simple_interest - (idx * (base_number * 0.05) if base_number > 0 else idx)
        
        if variation_add > 0 and variation_add != correct_simple_interest and variation_add not in temp_additional_wrong:
            val_to_add = int(variation_add) if isinstance(variation_add, float) and variation_add.is_integer() else round(variation_add, 2)
            if val_to_add != correct_simple_interest and val_to_add not in temp_additional_wrong:
                 temp_additional_wrong.add(val_to_add)
        
        if len(temp_additional_wrong) < 3 and variation_sub > 0 and variation_sub != correct_simple_interest and variation_sub not in temp_additional_wrong:
            val_to_add = int(variation_sub) if isinstance(variation_sub, float) and variation_sub.is_integer() else round(variation_sub, 2)
            if val_to_add != correct_simple_interest and val_to_add not in temp_additional_wrong:
                temp_additional_wrong.add(val_to_add)
                
        if idx > 10: # Safety break if variations are not generating new distinct values
             # Add simple +/- a small integer
            if correct_simple_interest + idx not in temp_additional_wrong and (correct_simple_interest + idx) != correct_simple_interest:
                temp_additional_wrong.add(correct_simple_interest + idx)
            if len(temp_additional_wrong) < 3 and correct_simple_interest - idx > 0 and correct_simple_interest - idx not in temp_additional_wrong and (correct_simple_interest - idx) != correct_simple_interest:
                 temp_additional_wrong.add(correct_simple_interest - idx)
        if idx > 20: # Ultimate safety break
            break
        idx += 1
    
    final_wrong_for_choices = list(temp_additional_wrong)[:3]

    # Ensure the correct answer is stringified appropriately
    correct_answer_str = str(int(correct_simple_interest) if isinstance(correct_simple_interest, float) and correct_simple_interest.is_integer() else round(correct_simple_interest, 2))
    
    # Combine correct answer with the chosen wrong answers (all as strings)
    final_choices_str = [correct_answer_str] + [str(ans) for ans in final_wrong_for_choices]
    
    # Shuffle the final list of choices
    random.shuffle(final_choices_str)
    
    # Pad if somehow we don't have 4 choices (should be rare)
    safety_idx = 1
    while len(final_choices_str) < 4:
        # Generate a simple padding value not already in the list
        padding_val_numeric = correct_simple_interest + safety_idx * 10 + random.randint(-5,5)
        if padding_val_numeric <=0 : padding_val_numeric = correct_simple_interest + safety_idx * 10 + 5 # ensure positive
        
        padding_val_str = str(int(padding_val_numeric) if isinstance(padding_val_numeric, float) and padding_val_numeric.is_integer() else round(padding_val_numeric,2))
        
        if padding_val_str not in final_choices_str:
            final_choices_str.append(padding_val_str)
        safety_idx += 1
        if safety_idx > 10: # Break if padding is problematic
            # Fallback: add very simple, potentially non-unique but different items
            final_choices_str.extend([str(correct_simple_interest + 100), str(correct_simple_interest + 200)]) 
            break
            
    return final_choices_str[:4]

def generate_square_formula_wrong_answers(int1, int2, operator: str = None):
    """
    Generates wrong answers for square formula questions
    Args:
        int1: int
        int2: int
        operator: str
    """
    wrong_answers = set()
    if operator == "+":
        wrong_answers.add((int1 + int2)**2)
        wrong_answers.add((int1 - int2)**2)
        wrong_answers.add(int2**2 + int1**2)
        wrong_answers.add((int1 + int2) * (int1 - int2))
    elif operator == "-":
        wrong_answers.add((int1 - int2)**2)
        wrong_answers.add((int1 + int2)**2)
        wrong_answers.add(int2**2 - int1**2)
        wrong_answers.add((int1 + int2) * (int1 - int2))
    else:
        wrong_answers.add((int1 + int2) * (int1 - int2))
        wrong_answers.add((int1 + int2)**2)
        wrong_answers.add((int1 - int2)**2)
        wrong_answers.add(int2**2 + int1**2)
    return list(wrong_answers)[:4]