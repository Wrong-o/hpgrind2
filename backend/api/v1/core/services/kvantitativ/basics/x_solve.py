import random as rd
from api.v1.core.services.equation_generator import integer_splitter, integer_expander, fraction_whole_number, integer_factorize

# TODO explanaiton skriver inte in int1 ordentligt
##

def explanation(operator, int1, int2):
    if operator == "+":
        exp_string = (
            "För att få x ensamt, ta minus "
            f"{int1} på båda sidor. När du har x"
            " ensamt på en sida och en siffra på andra är du klar"
        )
        return exp_string
    if operator == "-":
        exp_string = (
            "För att få x ensamt, ta plus x på båda sidor. "
            f"Sen tar du minus {int2} på båda sidor. "
            "När x står ensamt på en sida och en siffra på andra är du klar."
        )
        return exp_string

    if operator == "*":
        exp_string = (
            "Dela båda sidorna med talet som sitter ihop med x, "
            f"{int1}. När x står ensamt på ena sidan och "
            "en siffra på andra är du klar"
        )
        return exp_string

    if operator == "/":
        exp_string = (
            "Gångra båda sidor med siffran som står under x, "
            f"{int1}, för att få bort bråket. När x står ensamt på en sida "
            "och en siffra på andra är du klar"
        )
        return exp_string


def x_solve(difficulty):
    """_summary_
    Creates a solve for x question.
    difficulty settings:
    1. One operation needed
    2. Two operations, + or -
    3. Two operations needed, all operators avalible

    Args:
        difficulty (_int_): _How hard the question is_

    Returns:
        _type_: _question_data_
    """
    if difficulty == 1:
        question_data = rd.choice([
            integer_splitter(rd.randint(5, 20)),
            integer_expander(rd.randint(5, 20)),
            fraction_whole_number(),
            integer_factorize(factorize=None)
        ])
        operator = question_data["operator"]
        int1 = question_data["int1"]
        int2 = question_data["int2"]
        if operator == "+":
            question_data["correct_answer"] = int1 + int2
            question_data["question"] = f"{question_data['int1']} + {question_data['int2']}"
        elif operator == "-":
            question_data["correct_answer"] = int1 - int2
            question_data["question"] = f"{question_data['int1']} - x = {question_data['int2']}"
        elif operator == "*":
            question_data["correct_answer"] = int1 * int2
            question_data["question"] = f"{question_data['int1']} * {question_data['int2']}"
        elif operator == "/":
            question_data["correct_answer"] = int1 / int2
            question_data["question"] = f"{question_data['int1']} / {question_data['int2']}"
        else:
            return "Error, invalid operator"
    elif difficulty == 2:
        question_data = rd.choice([
            integer_expander(rd.randint(-12, 12), negative_allowed=True),
            integer_splitter(rd.randint(-12, 12), negative_allowed=True),
        ])
        question_data["extra_x"] = rd.randint(-5, 5)
        print(question_data)
        question_data["question"] = f"{question_data['int1']} {question_data['operator']} {question_data['extra_x'] + 1}x  = {question_data['result']} {question_data['extra_x']}x"
        question_data["correct_answer"] = question_data["int2"]

    elif difficulty == 3:
        question_data = rd.choice([
            integer_factorize(rd.randint(-12, 12), negative_allowed=True),
            fraction_whole_number(negative_allowed=True),
        ])
        question_data["correct_answer"] = question_data["int2"]
        extra_term = rd.randint(-12, 12)

        question_data["question"] = f"{question_data['int1']} {question_data['operator']} x + {extra_term} = {question_data['result'] + extra_term} "

    else:
        raise ValueError("Not a valid difficulty")
    return {
        "subject": "kvantitativ",
        "category": "basics",
        "question": question_data["question"],
        # "answers": question_data["answers"],
        "correct_answer": question_data["correct_answer"],
        "drawing": [],
        # "explanation": explanation(operator=operator, int1=int1, int2=int2)
    }
