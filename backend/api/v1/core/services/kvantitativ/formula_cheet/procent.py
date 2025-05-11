from api.v1.core.services.equation_generator import generate_percentage_whole_number

def procent_grundläggande():
    """
    Generates a basic percentage question
    """
    data = generate_percentage_whole_number()
    return {
        "subject": "kvantitativ",
        "category": "procent",
        "question": f"Vad är {data['percentage']}% av {data['base_number']}?",
        "answer": data['result']
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