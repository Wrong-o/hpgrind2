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
        "numerator": numerator,
        "denominator": denominator,
        "result": result
    }


def integer_splitter(split: int):
    """_summary_
    Splits an integer into two integers that sum up to the original integer.
    Raises:
        ValueError: If split is less than 2
    Returns:
        dict: {int1: int, int2: int} - two integers that sum up to split
    """
    if split < 2:
        raise ValueError("Integer must be greater than 2")
    int1 = rd.randint(1, split - 1)
    int2 = split - int1

    return {
        "int1": int1,
        "operator": "+",
        "int2": int2
    }


def integer_expander(expand: int):
    """_summary_
    Expands an integer into two integers with the difference integer.
    Raises:
        ValueError: If expand is not an integer
    Returns:
        dict: {int1: int, int2: int} - integers with difference equal to expand
    """

    try:
        int1 = expand + rd.randint(1, (100-expand))
        int2 = int1 - expand
    except ValueError:
        raise ValueError(f"Not an integer: {expand}")
    return {
        "int1": int1,
        "operator": "-",
        "int2": int2
    }


def integer_factorize(factorize: int):
    """_summary_
    Factorizes an integer into two integers with the product integer.
    Raises:
        ValueError: If factorize is not an integer
    Returns:
        dict: {int1: int, int2: int} - integers with product equal to factorize
    """
    if factorize is not int:
        raise ValueError("Not an integer")
    int1 = rd.randint(1, factorize)
    int2 = factorize // int1

    return {
        "int1": int1,
        "operator": "\\cdot",
        "int2": int2
    }


def fraction_equation(max_numerator: int = 2, max_denominator: int = 2):
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
