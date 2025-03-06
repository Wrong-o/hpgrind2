import random as rd
from api.v1.core.services.equation_generator import fraction_operations_order
from api.v1.core.services.wrong_answer_generator import generate_math_choices


def explanation():
    return r"""
    \text[ Räkneordning} \\
    \text{1. Räkna ut det som står i paranteserna} \\
    \text{2. Räkna ut upphöjt i och roten ur} \\
    \text{3. Gånger och delat med} \\
    \text{4. Addition and subtraction}
    \text{Minnesregel: Om man ritar upp räkneordningen blir det en tjur med ett ärr över ögat}
    \text{(      ) }
    \text{  *   /  }
    \text{    +    }
    \text{    -    }
    """


def operations_order(difficulty: int):
    """_summary_ Operations_order question with three different difficulties

    Args:
        difficulty (int): Different types of qustions based on difficulty

    Returns:
        _type_: _description_
        subject: string = kvantitativ
        category: string = basics
        question: string (Latex) = the question
        answers: list of strings (Latex) = the answers
        correct_answer: string = the correct answer
        drawing: list of lists = drawing if needed
        explanation: string (Latex) = the explanation
    """

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
        question_data = fraction_operations_order()
        question_data["question"] = question_data["latex_fraction"]
        question_data["correct_answer"] = question_data["result"]

    question_data["answers"] = generate_math_choices(
        question_data["question"], question_data["correct_answer"])
    return {
        "subject": "kvantitativ",
        "category": "basics",
        "question": question_data["question"],
        "answers": question_data["answers"],
        "correct_answer": str(question_data["correct_answer"]),
        "drawing": [],
        "explanation": explanation()
    }
