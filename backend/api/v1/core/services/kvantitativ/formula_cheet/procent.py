import random as rd
def procent_grundläggande():
    """
    Generates a basic percentage question
    """
    result = rd.randint(1, 100)
    percentage = rd.randint(1, 100)
    question = f"Vad är {percentage}% av {result}?"

    return {
        "subject": "kvantitativ",
        "category": "procent",
        "question": question,
        "answer": result * percentage / 100
    }
def procent_förändring():
    """
    Generates a percentage change question
    """
    return {
        "subject": "kvantitativ",
        "category": "procent",
        "question": "Vad är 10% av 100?",
        "answer": 10
    }
def procent_ränta():
    return {
        "subject": "kvantitativ",
        "category": "procent",
        "question": "Vad är 10% av 100?",
        "answer": 10
    }