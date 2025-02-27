import random as rd
from api.v1.core.services.equation_generator import fraction_equation
from api.v1.core.services.wrong_answer_generator import wrong_answer_generator


def operations_order(difficulty: int):
    if difficulty == 1:
        nrs = [rd.randint(1, 10) for _ in range(3)]
        question_data = rd.choice([
            {"question": f"({nrs[0]} + {nrs[1]}) \\cdot {nrs[2]}",
             "correct_answer": (nrs[0] + nrs[1]) * nrs[2]},
            {"question": f"{nrs[0]} \\cdot {nrs[1]} + {nrs[2]}",
                "correct_answer": nrs[0] * nrs[1] + nrs[2]},
            {"question": f"{nrs[0]} \\cdot ({nrs[1]} - {nrs[2]})",
             "correct_answer": nrs[0] * (nrs[1] - nrs[2])}
        ])

    if difficulty == 2:
        nrs = [rd.randint(1, 10)
               for _ in range(4)]
        question_data = rd.choice([
            {"question": f"({nrs[0]} + {nrs[1]}) \\cdot {nrs[2]} - {nrs[3]}",
             "correct_answer": (nrs[0] + nrs[1]) * nrs[2] - nrs[3]},
            {"question": f"{nrs[0]} \\cdot {nrs[1]} + {nrs[2]} \\cdot {nrs[3]}",
                "correct_answer": nrs[0] * nrs[1] + nrs[2] * nrs[3]},
            {"question": f"({nrs[0]} - {nrs[1]}) \\cdot ({nrs[2]} + {nrs[3]})", "correct_answer":
                (nrs[0] - nrs[1]) * (nrs[2] + nrs[3])}
        ])

    if difficulty == 3:
        question_data = fraction_equation()
        question_data["question"] = question_data["latex_fraction"]
        question_data["correct_answer"] = question_data["result"]
        question_data["answers"] = question_data["wrong_answers"]

    return {
        "subject": "kvantitativ",
        "category": "basics",
        "question": question_data["question"],
        "answers": question_data["answers"],
        "correct_answer": str(question_data["correct_answer"]),
        "drawing": [],
        "explanation": ""

    }
