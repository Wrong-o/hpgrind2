import random as rd
import math
from fractions import Fraction


def format_fraction_latex(fraction):
    """
    Format a fraction as LaTeX with the minus sign outside the fraction for negative values.
    
    Args:
        fraction: A Fraction object or string containing a LaTeX fraction
        
    Returns:
        str: LaTeX representation with minus sign outside fraction if negative
    """
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


def fraction_whole_number(negative_allowed: bool = False):
    """_summary_
    This function generates a fraction where the numerator is below 100.
    The result is always whole number.
    Returns:
        dict: (string, int) - numerator, denominator, result
    """
    if negative_allowed:
        result = rd.randint(-12, 12)
        denominator = rd.randint(-12, 12)
        numerator = result * denominator

    else:
        result = rd.randint(1, 10)
        denominator = rd.randint(2, 10)
        numerator = result * denominator

    return {
        "int1": numerator,
        "operator": "/",
        "int2": denominator,
        "result": result
    }


def integer_splitter(split: int, negative_allowed: bool = False, even_spacing: bool = False):
    """_summary_
    Splits an integer into two integers that sum up to the original integer.
    Defaults to not allowing negatives
    Raises:
    Returns:
        dict: {int1: int, int2: int} - two integers that sum up to split
    """
    if even_spacing:
        delta = rd.randint(1, 10)
        int1 = split + delta
        int2 = split - delta 
    elif negative_allowed:
        int1 = rd.randint(split - 20, split - 1)
        int2 = split - int1
    else:
        int1 = rd.randint(1, split - 1)
        int2 = split - int1

    return {
        "int1": int1,
        "operator": "+",
        "int2": int2,
        "result": split
    }


def integer_expander(expand: int, negative_allowed: bool = False):
    """_summary_
    Expands an integer into two integers with the difference of the original integer.
    Raises:
        ValueError: If expand is not an integer
    Returns:
        dict: {int1: int, int2: int} - integers with difference equal to expand
    """
    if negative_allowed:
        try:
            int1 = expand + rd.randint(1, 100)
            int2 = int1 - expand
        except ValueError:
            raise ValueError(f"Not an integer: {expand}")
    else:
        try:
            int1 = expand + rd.randint(1, (100-expand))
            int2 = int1 - expand
        except ValueError:
            raise ValueError(f"Not an integer: {expand}")
    return {
        "int1": int1,
        "operator": "-",
        "int2": int2,
        "result": expand
    }


def integer_factorize(factorize: int = None, negative_allowed: bool = False):
    """_summary_
    Factorizes an integer into two integers with the product integer.
    If called without factorize, will return 2 random integers
    Raises:
        ValueError: If factorize is not an integer
    Returns:
        dict: {int1: int, int2: int} - integers with product equal to factorize
    """
    print(factorize)
    if factorize:
        abs_factorize = abs(factorize)
        divisors = [i for i in range(
            1, abs_factorize + 1) if factorize % i == 0]

        if factorize < 0:
            divisors += [-i for i in divisors]
        int1 = rd.choice(divisors)
        int2 = factorize // int1
    else:
        int1 = rd.randint(-12, 12)
        int2 = rd.randint(-12, 12)
        factorize = int1 * int2

    return {
        "int1": int1,
        "operator": "*",
        "int2": int2,
        "result": factorize
    }


def random_fraction(negative_allowed: bool = False, max_numerator: int = 10, max_denominator: int = 10):
    """_summary_
    Generates a random fraction.
    Args:
        negative_allowed (bool, optional): If negative numbers are allowed. Defaults to False.
        max_numerator (int, optional): The maximum value of the numerator. Defaults to 10.
        max_denominator (int, optional): The maximum value of the denominator. Defaults to 10.
    Returns:
        dict: 
            numerator: integer
            denominator: integer
    """
    numerator = rd.randint(1, max_numerator)
    denominator = rd.randint(1, max_denominator)
    if denominator == numerator:
        if denominator == 1:
            denominator += 1
        else:
            denominator -= 1

    if negative_allowed:
        if rd.random() > 0.5:
            numerator = -numerator
        if rd.random() > 0.5:
            denominator = -denominator
    return {
        "numerator": numerator,
        "denominator": denominator
    }

def fraction_shortened(max_numerator: int = 1, max_denominator: int = 10, numerator: int = None, denominator: int = None):
    """_summary_
    Shortens to lowest possible denominator
    Returns:
        dict: {numerator: int, denominator: int} - shortened fraction
    """
    if numerator and denominator:
        gcd = math.gcd(numerator, denominator)
        return {
            "numerator": numerator // gcd,
            "denominator": denominator // gcd
        }
    else:
        fraction = random_fraction(max_numerator, max_denominator)
        gcd = math.gcd(fraction["numerator"], fraction["denominator"])
        return {
            "numerator": fraction["numerator"] // gcd,
            "denominator": fraction["denominator"] // gcd
    }

def fraction_operations_order(max_numerator: int = 2, max_denominator: int = 2):
    """_summary_
    Generates a fraction equation
    Returns:
        string: Latex formatted string
    """
    fraction = fraction_whole_number()
    wrong_answer_tracker = ""
    for i in range(1, max_numerator):
        if rd.random() > 0.5:
            try:
                split = integer_splitter(fraction["numerator"])
                wrong_answer_tracker += f"{split['int1']}{split['operator']}{split['int2']}"
                new_numerator = f"{split['int1']}{split['operator']}{split['int2']}"
            except ValueError:
                wrong_answer_tracker += str(fraction["numerator"])
                new_numerator = str(fraction["numerator"])
                pass
        else:
            try:
                expanded = integer_expander(fraction["numerator"])
                wrong_answer_tracker += f"{expanded['int1']}{expanded['operator']}{expanded['int2']}"
                new_numerator = f"{expanded['int1']} {expanded['operator']} {expanded['int2']}"
            except ValueError:
                wrong_answer_tracker += str(fraction["numerator"])
                new_numerator = str(fraction["numerator"])
                pass

    wrong_answer_tracker += "/"

    for i in range(1, max_denominator):
        if rd.random() > 0.5:
            try:
                split = integer_splitter(fraction["denominator"])
                wrong_answer_tracker += f"{split['int1']}{split['operator']}{split['int2']}"
                new_denominator = f"{split['int1']} {split['operator']} {split['int2']}"
            except ValueError:
                wrong_answer_tracker += str(fraction["denominator"])
                new_denominator = str(fraction["denominator"])
                pass
        else:
            try:
                expanded = integer_expander(fraction["denominator"])
                wrong_answer_tracker += f"{expanded['int1']}{expanded['operator']}{expanded['int2']}"
                new_denominator = f"{expanded['int1']} {expanded['operator']} {expanded['int2']}"
            except ValueError:
                wrong_answer_tracker += str(fraction["denominator"])
                new_denominator = str(fraction["denominator"])
                pass

    # Format LaTeX with minus sign outside fraction for negative values
    if new_numerator.startswith('-'):
        new_numerator = new_numerator[1:]  # Remove minus sign
        latex_fraction = f"-\\frac{{{new_numerator}}}{{{new_denominator}}}"
    else:
        latex_fraction = f"\\frac{{{new_numerator}}}{{{new_denominator}}}"

    return {
        "numerator": fraction["numerator"],
        "denominator": fraction["denominator"],
        "result": fraction["result"],
        "latex_fraction": latex_fraction,
        "wrong_answers": wrong_answer_tracker
    }


def generate_sequence_mean(even_n, max: int = 10, min: int = -10, n: int = 3, negative_allowed: bool = False, integers_only: bool = True, mean: float = None, median: float = None, mode: float = None):
    """Generates a sequence of integers and returns mean of the sequence

    Args:
        n (int, optional): Numbers of integers in the sequence. Defaults to 3.
        negative_allowed (bool, optional): Allows negative numbers in the sequence. Defaults to False.

    Returns: {
        sequence: list of int,
        mean: float
    }
    """
    sequence = []
    if not negative_allowed and min < 0:
        min = n
    if negative_allowed:
        min = -10
        max = 0
    mean = rd.randint(min, max)
    sum_of_sequence = mean * n
    if even_n:
        while len(sequence) < n:
            new_nrs = integer_splitter(split=mean*2, negative_allowed=negative_allowed)
            sequence.append(new_nrs["int1"])
            sequence.append(new_nrs["int2"])
    else:
        mean_change = rd.randint(1, 10)
        sequence.append(mean + mean_change)
        while len(sequence) < n:
            new_nrs = integer_splitter(split=mean*2, negative_allowed=negative_allowed)
            sequence.append(new_nrs["int1"])
            sequence.append(new_nrs["int2"])
        
        random_index = rd.randint(0, len(sequence) - 1)
        sequence[random_index] -= mean_change
        

    return {
        "sequence": sequence,
        "mean": mean,
    }

def generate_sequence_median(even_n, max: int = 20, min: int = -20, n: int = 3, negative_allowed: bool = False, integers_only: bool = True, mean: float = None, median: float = None, mode: float = None):
    """Generates a sequence of integers and returns median of the sequence

    Args:
        n (int, optional): Numbers of integers in the sequence. Defaults to 3.
        negative_allowed (bool, optional): Allows negative numbers in the sequence. Defaults to False.

    Returns: {
        sequence: list of int,
        median: float
    }
    """
    sequence = []
    if not negative_allowed and min < 0:
        min = n
    median = rd.randint(min, max)
    if even_n:
        while len(sequence) < n:
            new_nrs = integer_splitter(split=median, even_spacing=True)
            sequence.append(new_nrs["int1"])
            sequence.append(new_nrs["int2"])
    else:
        sequence.append(median)
        while len(sequence) < n:
            new_nrs = integer_splitter(split=median, even_spacing=True)
            sequence.append(new_nrs["int1"])
            sequence.append(new_nrs["int2"])

    return {
        "sequence": sequence,
        "median": median,
    }

def generate_sequence_mode(even_n, max: int = 20, min: int = -20, n: int = 3, negative_allowed: bool = False, integers_only: bool = True, mean: float = None, median: float = None, mode: float = None):
    """Generates a sequence of integers and returns mode of the sequence

    Args:
        n (int, optional): Numbers of integers in the sequence. Defaults to 3.
        negative_allowed (bool, optional): Allows negative numbers in the sequence. Defaults to False.

    Returns: {
        sequence: list of int,
        mode: int
    }
    """
    sequence = []
    if not negative_allowed and min < 0:
        min = n
    mode = rd.randint(min, max)
    sequence.append(mode)
    modifier_base = rd.randint(-n + 1, -1)
    for i in range(1, n):
        sequence.append(mode + modifier_base + i)
    return {
        "sequence": sequence,
        "mode": mode,
    }

def generate_linear_km():
    """
    Generates a random linear equation in the form y = mx + k
    and returns the values of x, m, k, and y.
    """
    # Generate random values for m, k, and x
    m = rd.randint(-3, 3)
    while m == 0:
        m = rd.randint(-3, 3)
    k = rd.randint(-3, 3)
    x = rd.randint(-5, 5)
    y = k * x + m
    return {
        "m": m,
        "k": k,
        "x": x,
        "y": y
    }

def divide_into_groups(n: int, groups: int):
    """
    Divides n items into groups
    Args:
        n (int): Number of items
        groups (int): Number of groups
    Returns:
        dict: {
            "groups": list of int,
        }
    """
    if groups > n:
        raise ValueError("Groups cannot be greater than n")
    if groups < 2:
        raise ValueError("Groups must be at least 2")
    if n < 2:
        raise ValueError("n must be at least 2")
    
    groups = [1] * groups
    for i in range(n - len(groups)):
        groups[rd.randint(0, len(groups) - 1)] += 1
    return groups

def generate_percentage_basics(base_number: int = None):
    """
    Generates a percentage of a whole number, ensuring all results are integers.
    Only returns simple percentages.
    Returns:
        dict: {
            "base_number": int,
            "percentage": int,
            "result": int
        }
    """
    while True:
        # Generate percentage components
        percent_denominator = rd.choice([4, 10]) # Denominators that easily yield round percentages
        # Generate numerator ensuring it's less than denominator - 1
        possible_numerators = list(range(1, percent_denominator - 1))
        if not possible_numerators: # Safety check, should not trigger with [4, 10]
            continue
        percent_numerator = rd.choice(possible_numerators)

        # Calculate percentage (guaranteed integer with denominators 4 or 10)
        percentage = int(percent_numerator * 100 / percent_denominator)

        # Generate a potential base number within a reasonable range
        current_base_number = rd.randint(10, 100)

        # Calculate the numerator for the result check
        result_numerator = current_base_number * percentage

        # Check if the result is a whole number (i.e., numerator is divisible by 100)
        if result_numerator % 100 == 0:
            result = result_numerator // 100
            # Ensure result is positive (should be guaranteed by ranges)
            if result > 0:
                # Found a valid combination where all are integers
                return {
                    "base_number": current_base_number,
                    "percentage": percentage,
                    "result": result
                }
        # If result wasn't an integer, the loop continues to find a valid combination

def generate_percentage_interest(base_number: int = None, interest_rate: int = None, time_period: int = None):
    """
    Generates data for a simple interest calculation.
    Ensures all results are integers.
    Returns:
        dict: {
            "base_number": int,
            "interest_rate": int, // This is the percentage value e.g. 50 for 50%
            "time_period": int,
            "result": int      // This is the simple interest amount (P * r * t)
        }
    """
    while True:
        current_base_number = base_number if base_number is not None else generate_percentage_basics()["base_number"]
        current_interest_rate_percent = interest_rate if interest_rate is not None else generate_percentage_basics()["percentage"]
        current_time_period = time_period if time_period is not None else rd.randint(1, 10)
            
        # Calculate simple interest: I = P * (rate/100) * t
        # Ensure the calculation results in an integer interest amount for simplicity in questions.
        # We can do this by ensuring (base_number * interest_rate_percent * time_period) is divisible by 100.
        
        potential_interest_numerator = current_base_number * current_interest_rate_percent * current_time_period
        
        if potential_interest_numerator % 100 == 0:
            simple_interest_amount = potential_interest_numerator // 100
            # Ensure interest is not zero, unless rate or time is zero (which basics usually avoid)
            if simple_interest_amount > 0: 
                return {
                    "base_number": current_base_number,
                    "interest_rate": current_interest_rate_percent, 
                    "time_period": current_time_period,
                    "result": simple_interest_amount # This 'result' is now the simple interest amount
                }
        
        # If result wasn't a whole number or valid, try again with new random values by not setting them for next loop
        # This happens if base_number, interest_rate, or time_period were passed in initially
        # and didn't result in an integer interest. To avoid infinite loop if specific params always fail,
        # we only reset if they were NOT provided initially.
        if base_number is None:
            current_base_number = None # Allow regeneration
        if interest_rate is None:
            current_interest_rate_percent = None # Allow regeneration
        if time_period is None:
            current_time_period = None # Allow regeneration
        
        # If all were provided and failed, we might loop infinitely. This case should be rare
        # given the problem constraints usually ensure integer results. Adding a small protection:
        if base_number is not None and interest_rate is not None and time_period is not None:
            # Fallback or error if specific inputs don't yield integer interest. For now, we let it retry.
            # Consider adding a max_retry counter if this becomes an issue.
            pass

def generate_square_formula(difficulty: int = 1, operator: str = None):

    """
    Generates a square formula
    DEFAULTS CONJUGATE FORMULA UNLESS OPERATOR IS SPECIFIED
    Args:
        operator (str): The operator to use in the formula
    Returns:
        dict: {
            "formula": str,
            "result": int
        }
    """
    int1 = rd.randint(1, 10)
    int2 = rd.randint(1, 10)
    while int1 == int2:
        int2 = rd.randint(1, 10)
    if operator == "+":
        formula = f"({int1} + {int2})²"
        result = (int1 + int2)**2
    elif operator == "-":
        formula = f"({int1} - {int2})²"
        result = (int1 - int2)**2
    else:
        formula = f"({int1} + {int2})({int1} - {int2})"
        result = (int1 + int2) * (int1 - int2)
    return {
        "int1": int1,
        "int2": int2,
        "operator": operator,
        "formula": formula,
        "result": result
    }