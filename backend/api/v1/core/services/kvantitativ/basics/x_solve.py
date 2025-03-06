import random as rd
from api.v1.core.services.equation_generator import integer_splitter, integer_expander, fraction_whole_number, integer_factorize


def explanation(operator, int1, int2):
    if operator == "+":

        return """
        \text{{1. Få x ensamt genom att ta minus {int2} på båda sidor}}
        \text{{2. När det står x på ena sidan och en siffra på andra är du klar}}

        """
    if operator == "-":

        return """
        \text{{1. Få x ensamt genom att ta plus {int2} på båda sidor}}
        \text{{2. När det står x på ena sidan och en siffra på andra är du klar}}

        """
    if operator == "*":

        return """
        \text{{1. Få x ensamt genom att ta dela båda sidor på {int2} }}
        \text{{2. När det står x på ena sidan och en siffra på andra är du klar}}

        """
    if operator == "/":

        return """
        \text{{1. Få x ensamt genom att gångra båda sidor på {int2} }}
        \text{{2. När det står x på ena sidan och en siffra på andra är du klar}}

        """


def x_solve(difficulty):
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
        question_data["question"] = f"{question_data['int1']} - {question_data['int2']}"
    elif operator == "*":
        question_data["correct_answer"] = int1 * int2
        question_data["question"] = f"{question_data['int1']} * {question_data['int2']}"
    elif operator == "/":
        question_data["correct_answer"] = int1 / int2
        question_data["question"] = f"{question_data['int1']} / {question_data['int2']}"
    else:
        return "Error, invalid operator"
    return {
        "subject": "kvantitativ",
        "category": "basics",
        "question": question_data["question"],
        # "answers": question_data["answers"],
        "correct_answer": question_data["correct_answer"],
        "drawing": [],
        "explanation": explanation(operator=operator, int1=int1, int2=int2)
    }
