import random as rd
import math

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

def fraction_shortened(max_numerator: int, max_denominator: int):
    """_summary_
    Shortens to lowest possible denominator
    Returns:
        dict: {numerator: int, denominator: int} - shortened fraction
    """
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

    latex_fraction = f"\\frac{{{new_numerator}}}{{{new_denominator}}}"
    return {
        "numerator": fraction["numerator"],
        "denominator": fraction["denominator"],
        "result": fraction["result"],
        "latex_fraction": latex_fraction,
        "wrong_answers": wrong_answer_tracker
    }


def generate_sequence_mean(even_n, max: int = 20, min: int = -20, n: int = 3, negative_allowed: bool = False, integers_only: bool = True, mean: float = None, median: float = None, mode: float = None):
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
    mean = rd.randint(min, max)
    sum_of_sequence = mean * n
    if even_n:
        while len(sequence) < n:
            new_nrs = integer_splitter(split=mean*2, negative_allowed=negative_allowed)
            sequence.append(new_nrs["int1"])
            sequence.append(new_nrs["int2"])
    else:
        sequence.append(mean)
        while len(sequence) < n:
            new_nrs = integer_splitter(split=mean*2, negative_allowed=negative_allowed)
            sequence.append(new_nrs["int1"])
            sequence.append(new_nrs["int2"])

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
    # TODO: DU ÄR HÄR
    sequence = []
    if not negative_allowed and min < 0:
        min = n
    mode = rd.randint(min, max)
    sequence.append(mode)
    if n < 4:
        sequence.append(mode)
        sequence.append(mode + 1)
        sequence.append(mode + 2)
    elif n < 6:
        sequence.append(mode)
        sequence.append(mode + 1)
        sequence.append(mode + 2)
    else:
        sequence.append(mode)
        sequence.append(mode + 1)
        sequence.append(mode + 2)
        sequence.append(mode + 3)
    return {
        "sequence": sequence,
        "mode": mode,
    }