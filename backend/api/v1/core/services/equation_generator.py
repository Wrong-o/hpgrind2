import random as rd


def fraction_whole_number():
    """_summary_
    This function generates a fraction where the numerator is below 100.
    The result is always whole number.
    Returns:
        dict: (string, int) - numerator, denominator, result
    """
    result = rd.randint(1, 10)
    denominator = rd.randint(2, 10)
    numerator = result * denominator

    return {
        "int1": numerator,
        "operator": "/",
        "int2": denominator,
        "result": result
    }


def integer_splitter(split: int, negative_allowed: bool = False):
    """_summary_
    Splits an integer into two integers that sum up to the original integer.
    Defaults to not allowing negatives
    Raises:
    Returns:
        dict: {int1: int, int2: int} - two integers that sum up to split
    """
    if negative_allowed:
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


def integer_factorize(factorize: int = None):
    """_summary_
    Factorizes an integer into two integers with the product integer.
    If called without factorize, will return 2 random integers
    Raises:
        ValueError: If factorize is not an integer
    Returns:
        dict: {int1: int, int2: int} - integers with product equal to factorize
    """
    if factorize:
        if factorize is not int:
            raise ValueError("Not an integer")
        int1 = rd.randint(1, factorize)
        int2 = factorize // int1
    else:
        int1 = rd.randint(1, 12)
        int2 = rd.randint(1, 12)
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
