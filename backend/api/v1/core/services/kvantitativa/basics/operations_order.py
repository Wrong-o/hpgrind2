import random as rd


def fraction_whole_number():
    """_summary_
    This function generates a fraction where the numerator is below 100.
    The result is always whole number.
    Returns:
        tuple: (string, string) - (numerator, denominator)
    """
    result = rd.randint(1, 10)
    denominator = rd.randint(2, 10)
    numerator = result * denominator

    return (numerator, denominator)


def operations_order(difficulty: int):

    if difficulty == 1:
        nrs = [rd.randint(1, 10) for _ in range(3)]
        question = rd.choice([
            f"({nrs[0]} + {nrs[1]}) \\cdot {nrs[2]}",
            f"{nrs[0]} \\cdot {nrs[1]} + {nrs[2]}",
            f"{nrs[0]} \\cdot ({nrs[1]} - {nrs[2]})",
        ])

    if difficulty == 2:
        nrs = [rd.randint(1, 10) for _ in range(4)]
        question = rd.choice([
            f"({nrs[0]} + {nrs[1]}) \\cdot {nrs[2]} - {nrs[3]}",
            f"{nrs[0]} \\cdot {nrs[1]} + {nrs[2]} \\cdot {nrs[3]}",
            f"({nrs[0]} - {nrs[1]}) \\cdot ({nrs[2]} + {nrs[3]})",
        ])
    return question
