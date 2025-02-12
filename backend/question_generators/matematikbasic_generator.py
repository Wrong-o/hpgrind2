from typing import List, Dict, Any
import random
import uuid

def generate_matematikbasic_question(delmoment_list: List[str]) -> Dict[str, Any]:
    """
    Generate a basic math question based on the given delmoment.
    
    Args:
        delmoment_list: List of applicable delmoment for this question
        
    Returns:
        Dict containing question data following the required format
    """
    question_types = {
        # Räkneregler
        "matematikbasic-räknelagar": [
            {
                "subject": "Matematik",
                "category": "Grunderna",
                "moment": "matematikbasic-räknelagar",
                "difficulty": 1,
                "question": "Vilket av följande uttryck är lika med $3 \\cdot (4 + 2)$?",
                "answers": [
                    "$3 \\cdot 4 + 3 \\cdot 2$",
                    "$3 + 4 \\cdot 2$",
                    "$3 \\cdot 4 + 2$",
                    "$3 + 4 + 2$"
                ],
                "correct_answer": "$3 \\cdot 4 + 3 \\cdot 2$",
                "drawing": [],
                "explanation": "Enligt den distributiva lagen kan man skriva om $3 \\cdot (4 + 2)$ som $3 \\cdot 4 + 3 \\cdot 2$"
            }
        ],
        
        # Fraktioner - Förlänga
        "matematikbasic-fraktioner-förlänga": [
            {
                "subject": "Matematik",
                "category": "Grunderna",
                "moment": "matematikbasic-fraktioner-förlänga",
                "difficulty": 2,
                "question": "Förläng bråket $\\frac{2}{3}$ så att nämnaren blir 12",
                "answers": [
                    "$\\frac{8}{12}$",
                    "$\\frac{6}{12}$",
                    "$\\frac{4}{12}$",
                    "$\\frac{10}{12}$"
                ],
                "correct_answer": "$\\frac{8}{12}$",
                "drawing": [],
                "explanation": "För att förlänga $\\frac{2}{3}$ till en nämnare på 12, multiplicerar vi täljare och nämnare med 4 eftersom $3 \\cdot 4 = 12$. Därför blir det nya bråket $\\frac{2 \\cdot 4}{3 \\cdot 4} = \\frac{8}{12}$"
            }
        ],

        # Fraktioner - Förkorta
        "matematikbasic-fraktioner-förkorta": [
            {
                "subject": "Matematik",
                "category": "Grunderna",
                "moment": "matematikbasic-fraktioner-förkorta",
                "difficulty": 2,
                "question": "Förkorta bråket $\\frac{12}{18}$ så mycket som möjligt",
                "answers": [
                    "$\\frac{2}{3}$",
                    "$\\frac{4}{6}$",
                    "$\\frac{6}{9}$",
                    "$\\frac{3}{4}$"
                ],
                "correct_answer": "$\\frac{2}{3}$",
                "drawing": [],
                "explanation": "För att förkorta $\\frac{12}{18}$ letar vi efter den största gemensamma nämnaren. Både 12 och 18 är delbara med 6, så vi får $\\frac{12 \\div 6}{18 \\div 6} = \\frac{2}{3}$"
            }
        ],

        # Fraktioner - Addera
        "matematikbasic-fraktioner-adda": [
            {
                "subject": "Matematik",
                "category": "Grunderna",
                "moment": "matematikbasic-fraktioner-adda",
                "difficulty": 3,
                "question": "Beräkna $\\frac{1}{3} + \\frac{1}{6}$",
                "answers": [
                    "$\\frac{1}{2}$",
                    "$\\frac{2}{9}$",
                    "$\\frac{2}{6}$",
                    "$\\frac{1}{9}$"
                ],
                "correct_answer": "$\\frac{1}{2}$",
                "drawing": [],
                "explanation": "För att addera bråk med olika nämnare:\n1. Förläng bråken till samma nämnare (6)\n2. $\\frac{1}{3} = \\frac{2}{6}$ och $\\frac{1}{6}$ är redan i rätt form\n3. $\\frac{2}{6} + \\frac{1}{6} = \\frac{3}{6} = \\frac{1}{2}$"
            }
        ],

        # Fraktioner - Multiplicera
        "matematikbasic-fraktioner-multiplicera": [
            {
                "subject": "Matematik",
                "category": "Grunderna",
                "moment": "matematikbasic-fraktioner-multiplicera",
                "difficulty": 2,
                "question": "Beräkna $\\frac{2}{3} \\cdot \\frac{3}{4}$",
                "answers": [
                    "$\\frac{1}{2}$",
                    "$\\frac{5}{7}$",
                    "$\\frac{6}{12}$",
                    "$\\frac{3}{5}$"
                ],
                "correct_answer": "$\\frac{1}{2}$",
                "drawing": [],
                "explanation": "När man multiplicerar bråk:\n1. Multiplicera täljarna: $2 \\cdot 3 = 6$\n2. Multiplicera nämnarna: $3 \\cdot 4 = 12$\n3. Förkorta resultatet: $\\frac{6}{12} = \\frac{1}{2}$"
            }
        ],

        # Ekvationslösning - Division
        "matematikbasic-ekvationslösning-division": [
            {
                "subject": "Matematik",
                "category": "Grunderna",
                "moment": "matematikbasic-ekvationslösning-division",
                "difficulty": 2,
                "question": "Lös ekvationen $3x = 12$",
                "answers": [
                    "$x = 4$",
                    "$x = 3$",
                    "$x = 6$",
                    "$x = 9$"
                ],
                "correct_answer": "$x = 4$",
                "drawing": [],
                "explanation": "För att lösa ekvationen $3x = 12$:\n1. Dividera båda leden med 3\n2. $\\frac{3x}{3} = \\frac{12}{3}$\n3. $x = 4$"
            }
        ],

        # Ekvationslösning - Multiplikation
        "matematikbasic-ekvationslösning-multiplikation": [
            {
                "subject": "Matematik",
                "category": "Grunderna",
                "moment": "matematikbasic-ekvationslösning-multiplikation",
                "difficulty": 2,
                "question": "Lös ekvationen $\\frac{x}{4} = 3$",
                "answers": [
                    "$x = 12$",
                    "$x = 7$",
                    "$x = 1$",
                    "$x = 3$"
                ],
                "correct_answer": "$x = 12$",
                "drawing": [],
                "explanation": "För att lösa ekvationen $\\frac{x}{4} = 3$:\n1. Multiplicera båda leden med 4\n2. $4 \\cdot \\frac{x}{4} = 4 \\cdot 3$\n3. $x = 12$"
            }
        ],

        # Ekvationslösning - Addition
        "matematikbasic-ekvationslösning-addition": [
            {
                "subject": "Matematik",
                "category": "Grunderna",
                "moment": "matematikbasic-ekvationslösning-addition",
                "difficulty": 2,
                "question": "Lös ekvationen $x - 5 = 7$",
                "answers": [
                    "$x = 12$",
                    "$x = 2$",
                    "$x = -2$",
                    "$x = 8$"
                ],
                "correct_answer": "$x = 12$",
                "drawing": [],
                "explanation": "För att lösa ekvationen $x - 5 = 7$:\n1. Addera 5 till båda leden\n2. $x - 5 + 5 = 7 + 5$\n3. $x = 12$"
            }
        ],

        # Ekvationslösning - Subtraktion
        "matematikbasic-ekvationslösning-subtraktion": [
            {
                "subject": "Matematik",
                "category": "Grunderna",
                "moment": "matematikbasic-ekvationslösning-subtraktion",
                "difficulty": 2,
                "question": "Lös ekvationen $x + 3 = 10$",
                "answers": [
                    "$x = 7$",
                    "$x = 13$",
                    "$x = 4$",
                    "$x = -3$"
                ],
                "correct_answer": "$x = 7$",
                "drawing": [],
                "explanation": "För att lösa ekvationen $x + 3 = 10$:\n1. Subtrahera 3 från båda leden\n2. $x + 3 - 3 = 10 - 3$\n3. $x = 7$"
            }
        ]
    }

    # If no specific delmoment is provided, choose a random one
    if not delmoment_list:
        delmoment = random.choice(list(question_types.keys()))
    else:
        # Filter available delmoments based on the provided list
        available_delmoments = [d for d in delmoment_list if d in question_types]
        if not available_delmoments:
            delmoment = random.choice(list(question_types.keys()))
        else:
            delmoment = random.choice(available_delmoments)

    # Get questions for the chosen delmoment
    questions = question_types[delmoment]
    
    # Choose a random question from the available ones
    question_data = random.choice(questions)
    
    # Add unique ID
    question_data["id"] = str(uuid.uuid4())
    
    # Randomize the order of answers while keeping track of the correct one
    answers = question_data["answers"].copy()
    correct_answer = question_data["correct_answer"]
    random.shuffle(answers)
    question_data["answers"] = answers
    question_data["correct_answer"] = correct_answer
    
    return question_data 