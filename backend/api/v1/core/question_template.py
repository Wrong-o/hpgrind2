import random as rd 


def choices_generator(correct_answer: str, wrong_answers: list[str]):
    """
    Generates a list of choices
    """
    return [correct_answer] + wrong_answers

def question_template(subject: str, category: str, question: str, answers: list[str], correct_answer: str, explanation: str):
    """
    Returns a question template
    """
    return {
        "subject": "Subject",
        "category": "Category",
        "question": "Question",
        "answers": ["1", "3", "4", "5"],
        "correct_answer": "1",
        "explanation": "Video.mp4"
    }
