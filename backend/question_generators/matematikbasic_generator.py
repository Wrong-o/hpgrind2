from typing import List, Dict, Any
import random
import uuid

def generate_random_fraction(max_numerator: int = 12, max_denominator: int = 12) -> tuple:
    """Generate a random fraction with calculator-friendly numbers."""
    numerator = random.randint(1, max_numerator)
    denominator = random.randint(2, max_denominator)
    return numerator, denominator

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
                "subject": "Kvantitativa",
                "category": "Grundläggande",
                "moment": "matematikbasic-räknelagar",
                "difficulty": 1,
                "question": "Vilket av följande uttryck är lika med ${a} \\cdot ({b} + {c})$?",
                "template_vars": lambda: {"a": random.randint(2, 6), "b": random.randint(2, 5), "c": random.randint(2, 4)},
                "answer_generator": lambda vars: {
                    "correct": f"${vars['a']} \\cdot {vars['b']} + {vars['a']} \\cdot {vars['c']}$",
                    "wrong": [
                        f"${vars['a']} + {vars['b']} \\cdot {vars['c']}$",
                        f"${vars['a']} \\cdot {vars['b']} + {vars['c']}$",
                        f"${vars['a']} + {vars['b']} + {vars['c']}$"
                    ]
                },
                "explanation_template": "Enligt den distributiva lagen kan man skriva om ${a} \\cdot ({b} + {c})$ som ${a} \\cdot {b} + {a} \\cdot {c}$"
            }
        ],
        
        # Fraktioner - Förlänga
        "matematikbasic-fraktioner-förlänga": [
            {
                "subject": "Kvantitativa",
                "category": "Grundläggande",
                "moment": "matematikbasic-fraktioner-förlänga",
                "difficulty": 2,
                "question": "Förläng bråket $\\frac{{{a}}}{{{b}}}$ så att nämnaren blir {target_denominator}",
                "template_vars": lambda: {
                    "a": random.randint(1, 6),
                    "b": random.randint(2, 6),
                    "target_denominator": lambda a, b: b * random.randint(2, 4)
                },
                "answer_generator": lambda vars: {
                    "correct": f"$\\frac{{{vars['a'] * (vars['target_denominator'] // vars['b'])}}}{{{vars['target_denominator']}}}$",
                    "wrong": [
                        f"$\\frac{{{vars['a'] * ((vars['target_denominator'] // vars['b']) - 1)}}}{{{vars['target_denominator']}}}$",
                        f"$\\frac{{{vars['a'] * ((vars['target_denominator'] // vars['b']) + 1)}}}{{{vars['target_denominator']}}}$",
                        f"$\\frac{{{vars['a']}}}{{{vars['target_denominator']}}}$"
                    ]
                },
                "explanation_template": "För att förlänga $\\frac{{{a}}}{{{b}}}$ till en nämnare på {target_denominator}, multiplicerar vi täljare och nämnare med {multiplier} eftersom ${b} \\cdot {multiplier} = {target_denominator}$"
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

    # Get question template for the chosen delmoment
    question_template = random.choice(question_types[delmoment])
    
    # Generate variables for the template
    vars = question_template["template_vars"]()
    if callable(vars.get("target_denominator")):
        vars["target_denominator"] = vars["target_denominator"](vars["a"], vars["b"])
    vars["multiplier"] = vars["target_denominator"] // vars["b"]
    
    # Generate answers
    answers = question_template["answer_generator"](vars)
    all_answers = [answers["correct"]] + answers["wrong"]
    random.shuffle(all_answers)
    
    # Create question data
    question_data = {
        "id": str(uuid.uuid4()),
        "subject": question_template["subject"],
        "category": question_template["category"],
        "moment": question_template["moment"],
        "difficulty": question_template["difficulty"],
        "question": question_template["question"].format(**vars),
        "answers": all_answers,
        "correct_answer": answers["correct"],
        "drawing": [],
        "explanation": question_template["explanation_template"].format(**vars)
    }
    
    return question_data 