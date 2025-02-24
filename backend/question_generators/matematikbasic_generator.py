from typing import List, Dict, Any
import random
import uuid
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def generate_random_fraction(max_numerator: int = 12, max_denominator: int = 12) -> tuple:
    """Generate a random fraction with calculator-friendly numbers."""
    numerator = random.randint(1, max_numerator)
    denominator = random.randint(2, max_denominator)
    return numerator, denominator

# Define question types outside the function
QUESTION_TYPES = {
    # Räkneregler
    "matematikbasic-räknelagar": [
        {
            "subject": "Kvantitativa",
            "category": "Grundläggande",
            "moment": "matematikbasic-räknelagar",
            "difficulty": 1,
            "question": "Beräkna uttrycket ${expression}$",
            "template_vars": lambda: {
                # Generate a random expression with 2-4 operations
                "num_operations": random.randint(2, 4),
                "nums": [random.randint(2, 12) for _ in range(5)],  # Generate 5 numbers to have enough
                "expression": lambda vars: {
                    2: lambda n: [  # 2 operations
                        f"({n[0]} + {n[1]}) \\cdot {n[2]}",  # Parentheses and multiplication
                        f"{n[0]} \\cdot {n[1]} + {n[2]}",    # Multiplication and addition
                        f"{n[0]} \\cdot ({n[1]} - {n[2]})",  # Multiplication and subtraction
                    ][random.randint(0, 2)],
                    3: lambda n: [  # 3 operations
                        f"({n[0]} + {n[1]}) \\cdot {n[2]} - {n[3]}",  # Parentheses, multiplication, subtraction
                        f"{n[0]} \\cdot {n[1]} + {n[2]} \\cdot {n[3]}", # Two multiplications and addition
                        f"({n[0]} - {n[1]}) \\cdot ({n[2]} + {n[3]})",  # Two sets of parentheses
                    ][random.randint(0, 2)],
                    4: lambda n: [  # 4 operations
                        f"({n[0]} - {n[1]}) \\cdot ({n[2]} + {n[3]}) \\cdot {n[4]}", # Two sets of parentheses, multiplication
                        f"({n[0]} - {n[1]}) \\cdot ({n[2]} + {n[3]}) \\div {n[4]}", # Two sets of parentheses, division
                        f"({n[0]} - {n[1]}) \\cdot ({n[2]} + {n[3]}) \\cdot \\frac{{1}}{{{n[4]}}}", # Two sets of parentheses, division as fraction
                    ][random.randint(0, 2)]
                }[vars["num_operations"]](vars["nums"]),
                "result": lambda vars: eval(
                    vars["expression"]
                    .replace("\\cdot", "*")
                    .replace("\\div", "/")
                    .replace("\\frac{1}", "1")
                    .replace("{", "")
                    .replace("}", "")
                    .replace("\\", "")
                ),
            },
            "answer_generator": lambda vars: {
                "correct": f"${int(vars['result'])}$",
                "wrong": [
                    # Common mistakes from wrong order of operations
                    f"${int(vars['result']) + 1}$",  # Off by one
                    f"${int(vars['result']) - 1}$",  # Off by one
                    f"${int(vars['result'] * 2)}$"   # Double the correct answer
                ]
            },
            "explanation_template": lambda vars: (
                "För att lösa detta uttryck följer vi räkneordningen:\n"
                "1. Först räknar vi ut det som står inom parenteser\n"
                "2. Sedan utför vi multiplikation och division från vänster till höger\n"
                "3. Sist utför vi addition och subtraktion från vänster till höger\n\n"
                f"I detta fall blir resultatet ${int(vars['result'])}$"
            )
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
            "subject": "Kvantitativa",
            "category": "Grundläggande",
            "moment": "matematikbasic-fraktioner-förkorta",
            "difficulty": 2,
            "question": "Förkorta bråket $\\frac{{{a}}}{{{b}}}$ så mycket som möjligt",
            "template_vars": lambda: {
                "a": random.randint(2, 12) * 2,  # Even number for easy reduction
                "b": lambda vars: vars['a'] * random.randint(2, 3),  # Ensure reducible fraction
                "question": lambda vars: f"Förkorta bråket $\\frac{{{vars['a']}}}{{{vars['b']}}}$ så mycket som möjligt",
                "correct": lambda vars: f"$\\frac{{{vars['a'] // 2}}}{{{vars['b'] // 2}}}$",
                "wrong": lambda vars: [
                    f"$\\frac{{{vars['a'] // 4}}}{{{vars['b'] // 4}}}$",
                    f"$\\frac{{{vars['a']}}}{{2}}$",
                    f"$\\frac{{{vars['a'] // 2}}}{{{vars['b']}}}$"
                ],
                "explanation": lambda vars: f"För att förkorta $\\frac{{{vars['a']}}}{{{vars['b']}}}$ letar vi efter den största gemensamma nämnaren. Både {vars['a']} och {vars['b']} är delbara med 2, så vi får $\\frac{{{vars['a']} \\div 2}}{{{vars['b']} \\div 2}} = \\frac{{{vars['a']//2}}}{{{vars['b']//2}}}$"
            },
            "explanation_template": lambda vars: vars["explanation"]
        }
    ],

    # Fraktioner - Addera
    "matematikbasic-fraktioner-addera": [
        {
            "subject": "Kvantitativa",
            "category": "Grundläggande",
            "moment": "matematikbasic-fraktioner-addera",
            "difficulty": 3,
            "question": "Beräkna $\\frac{{{a}}}{{{b}}} + \\frac{{{c}}}{{{d}}}$",
            "template_vars": lambda: {
                "b": random.randint(2, 6),  # First denominator
                "d": random.randint(2, 6),  # Second denominator
                "a": random.randint(1, 3),  # First numerator
                "c": random.randint(1, 3)   # Second numerator
            },
            "answer_generator": lambda vars: {
                "correct": f"$\\frac{{{vars['a']*vars['d'] + vars['c']*vars['b']}}}{{{vars['b']*vars['d']}}}$",
                "wrong": [
                    f"$\\frac{{{vars['a'] + vars['c']}}}{{{vars['b'] + vars['d']}}}$",
                    f"$\\frac{{{vars['a']*vars['d'] + vars['c']*vars['b'] + 1}}}{{{vars['b']*vars['d']}}}$",
                    f"$\\frac{{{vars['a']*vars['d'] + vars['c']*vars['b'] - 1}}}{{{vars['b']*vars['d']}}}$"
                ]
            },
            "explanation_template": "För att addera bråk med olika nämnare:\n1. Förläng bråken till samma nämnare ({b}·{d})\n2. $\\frac{{{a}}}{{{b}}} = \\frac{{{a}·{d}}}{{{b}·{d}}}$ och $\\frac{{{c}}}{{{d}}} = \\frac{{{c}·{b}}}{{{d}·{b}}}$\n3. $\\frac{{{a}·{d}}}{{{b}·{d}}} + \\frac{{{c}·{b}}}{{{b}·{d}}} = \\frac{{{a}·{d} + {c}·{b}}}{{{b}·{d}}}$"
        }
    ],

    # Fraktioner - Multiplicera
    "matematikbasic-fraktioner-multiplicera": [
        {
            "subject": "Kvantitativa",
            "category": "Grundläggande",
            "moment": "matematikbasic-fraktioner-multiplicera",
            "difficulty": 2,
            "question": "Beräkna $\\frac{{{a}}}{{{b}}} \\cdot \\frac{{{c}}}{{{d}}}$",
            "template_vars": lambda: {
                "a": random.randint(1, 4),
                "b": random.randint(2, 4),
                "c": random.randint(1, 4),
                "d": random.randint(2, 4)
            },
            "answer_generator": lambda vars: {
                "correct": f"$\\frac{{{vars['a']*vars['c']}}}{{{vars['b']*vars['d']}}}$",
                "wrong": [
                    f"$\\frac{{{vars['a']+vars['c']}}}{{{vars['b']+vars['d']}}}$",
                    f"$\\frac{{{vars['a']*vars['c']+1}}}{{{vars['b']*vars['d']}}}$",
                    f"$\\frac{{{vars['a']*vars['c']-1}}}{{{vars['b']*vars['d']}}}$"
                ]
            },
            "explanation_template": "När man multiplicerar bråk:\n1. Multiplicera täljarna: ${a} \\cdot {c} = {a*c}$\n2. Multiplicera nämnarna: ${b} \\cdot {d} = {b*d}$\n3. Resultatet blir $\\frac{{{a*c}}}{{{b*d}}}$"
        }
    ],

    # Ekvationslösning - Division
    "matematikbasic-ekvationslösning-division": [
        {
            "subject": "Kvantitativa",
            "category": "Grundläggande",
            "moment": "matematikbasic-ekvationslösning-division",
            "difficulty": 2,
            "question": "Lös ekvationen ${a}x = {b}$",
            "template_vars": lambda: {
                "a": random.randint(2, 6),
                "b": lambda vars: vars['a'] * random.randint(2, 6)  # Ensure clean division
            },
            "answer_generator": lambda vars: {
                "correct": f"$x = {vars['b'] // vars['a']}$",
                "wrong": [
                    f"$x = {vars['b'] // vars['a'] + 1}$",
                    f"$x = {vars['b'] // vars['a'] - 1}$",
                    f"$x = {vars['b'] * vars['a']}$"
                ]
            },
            "explanation_template": "För att lösa ekvationen ${a}x = {b}$:\n1. Dividera båda leden med {a}\n2. $\\frac{{{a}x}}{{{a}}} = \\frac{{{b}}}{{{a}}}$\n3. $x = {b//a}$"
        }
    ],

    # Ekvationslösning - Multiplikation
    "matematikbasic-ekvationslösning-multiplikation": [
        {
            "subject": "Kvantitativa",
            "category": "Grundläggande",
            "moment": "matematikbasic-ekvationslösning-multiplikation",
            "difficulty": 2,
            "question": "Lös ekvationen $\\frac{x}{{{a}}} = {b}$",
            "template_vars": lambda: {
                "a": random.randint(2, 6),
                "b": random.randint(2, 6)
            },
            "answer_generator": lambda vars: {
                "correct": f"$x = {vars['a'] * vars['b']}$",
                "wrong": [
                    f"$x = {vars['a'] + vars['b']}$",
                    f"$x = {vars['a'] * vars['b'] + 1}$",
                    f"$x = {vars['a'] * vars['b'] - 1}$"
                ]
            },
            "explanation_template": "För att lösa ekvationen $\\frac{x}{{{a}}} = {b}$:\n1. Multiplicera båda leden med {a}\n2. ${a} \\cdot \\frac{x}{{{a}}} = {a} \\cdot {b}$\n3. $x = {a*b}$"
        }
    ],

    # Ekvationslösning - Addition
    "matematikbasic-ekvationslösning-addition": [
        {
            "subject": "Kvantitativa",
            "category": "Grundläggande",
            "moment": "matematikbasic-ekvationslösning-addition",
            "difficulty": 2,
            "question": "Lös ekvationen $x - {a} = {b}$",
            "template_vars": lambda: {
                "a": random.randint(2, 10),
                "b": random.randint(5, 15)
            },
            "answer_generator": lambda vars: {
                "correct": f"$x = {vars['a'] + vars['b']}$",
                "wrong": [
                    f"$x = {vars['b'] - vars['a']}$",
                    f"$x = {vars['a'] + vars['b'] + 1}$",
                    f"$x = {vars['a'] + vars['b'] - 1}$"
                ]
            },
            "explanation_template": "För att lösa ekvationen $x - {a} = {b}$:\n1. Addera {a} till båda leden\n2. $x - {a} + {a} = {b} + {a}$\n3. $x = {a+b}$"
        }
    ],

    # Ekvationslösning - Subtraktion
    "matematikbasic-ekvationslösning-subtraktion": [
        {
            "subject": "Kvantitativa",
            "category": "Grundläggande",
            "moment": "matematikbasic-ekvationslösning-subtraktion",
            "difficulty": 2,
            "question": "Lös ekvationen $x + {a} = {b}$",
            "template_vars": lambda: {
                "a": random.randint(2, 10),
                "b": lambda vars: vars['a'] + random.randint(5, 15)  # Ensure positive result
            },
            "answer_generator": lambda vars: {
                "correct": f"$x = {vars['b'] - vars['a']}$",
                "wrong": [
                    f"$x = {vars['b'] + vars['a']}$",
                    f"$x = {vars['b'] - vars['a'] + 1}$",
                    f"$x = {vars['b'] - vars['a'] - 1}$"
                ]
            },
            "explanation_template": "För att lösa ekvationen $x + {a} = {b}$:\n1. Subtrahera {a} från båda leden\n2. $x + {a} - {a} = {b} - {a}$\n3. $x = {b-a}$"
        }
    ]
}

def generate_matematikbasic_question(delmoment_list: List[str]) -> Dict[str, Any]:
    """
    Generate a basic math question based on the given delmoment.
    """
    try:
        logger.debug(f"Starting question generation with delmoments: {delmoment_list}")
        
        # Choose a question type
        if not delmoment_list:
            delmoment = random.choice(list(QUESTION_TYPES.keys()))
        else:
            available_delmoments = [d for d in delmoment_list if d in QUESTION_TYPES]
            delmoment = random.choice(available_delmoments) if available_delmoments else random.choice(list(QUESTION_TYPES.keys()))
        
        logger.debug(f"Selected delmoment: {delmoment}")
        
        # Get a random question template for the selected delmoment
        question_template = random.choice(QUESTION_TYPES[delmoment])
        
        # Generate template variables
        template_vars = question_template["template_vars"]()
        vars = {}
        
        # First pass: Process non-dependent variables
        for key, value in template_vars.items():
            if not callable(value):
                vars[key] = value
        
        # Second pass: Process dependent variables
        for key, value in template_vars.items():
            if callable(value):
                if key == "expression":
                    vars[key] = value(vars)
                elif key == "b" and "a" in vars:  # Special handling for dependent variables
                    vars[key] = value(vars)
                elif key == "target_denominator" and "b" in vars:
                    vars[key] = value(vars['a'], vars['b'])
                elif key == "result" and "expression" in vars:
                    vars[key] = value(vars)
                elif key == "question" and all(k in vars for k in ["a", "b"]):
                    vars[key] = value(vars)
                elif key == "correct" and all(k in vars for k in ["a", "b"]):
                    vars[key] = value(vars)
                elif key == "wrong" and all(k in vars for k in ["a", "b"]):
                    vars[key] = value(vars)
                elif key == "explanation" and all(k in vars for k in ["a", "b"]):
                    vars[key] = value(vars)
                elif callable(value):
                    try:
                        vars[key] = value(vars)
                    except TypeError:
                        vars[key] = value
        
        logger.debug(f"Generated variables: {vars}")
        
        # Evaluate result if it's still a function
        if "result" in vars and callable(vars["result"]):
            vars["result"] = vars["result"](vars)
        
        # Add derived variables needed for explanations
        if "target_denominator" in vars and "b" in vars:
            vars["multiplier"] = vars["target_denominator"] // vars["b"]
        
        # Add arithmetic operation results needed for explanations
        if "a" in vars and "b" in vars:
            # Store arithmetic operations as strings to match template keys
            vars["a+b"] = str(vars["a"] + vars["b"])
            vars["a-b"] = str(vars["a"] - vars["b"])
            vars["b-a"] = str(vars["b"] - vars["a"])
            # Store multiplication in both formats
            mult_result = str(vars["a"] * vars["b"])
            vars["a*b"] = mult_result
            vars["a·b"] = mult_result
            if vars["b"] != 0:  # Protect against division by zero
                # Store both division formats
                div_result = str(vars["a"] // vars["b"])
                vars["a/b"] = div_result
                vars["a//b"] = div_result
            if vars["a"] != 0:  # Protect against division by zero for reverse division
                # Store both division formats
                div_result = str(vars["b"] // vars["a"])
                vars["b/a"] = div_result
                vars["b//a"] = div_result
        
        if "c" in vars and "d" in vars:
            # Store multiplication in both formats
            mult_result = str(vars["c"] * vars["d"])
            vars["c*d"] = mult_result
            vars["c·d"] = mult_result
            vars["c+d"] = str(vars["c"] + vars["d"])
            vars["c-d"] = str(vars["c"] - vars["d"])
            vars["d-c"] = str(vars["d"] - vars["c"])
            if vars["d"] != 0:  # Protect against division by zero
                # Store both division formats
                div_result = str(vars["c"] // vars["d"])
                vars["c/d"] = div_result
                vars["c//d"] = div_result
            if vars["c"] != 0:  # Protect against division by zero for reverse division
                # Store both division formats
                div_result = str(vars["d"] // vars["c"])
                vars["d/c"] = div_result
                vars["d//c"] = div_result
                
        # Handle cross-pair multiplications if needed (e.g., a*c, b*d)
        if all(x in vars for x in ["a", "b", "c", "d"]):
            # Store a*c in both formats
            mult_result = str(vars["a"] * vars["c"])
            vars["a*c"] = mult_result
            vars["a·c"] = mult_result
            # Store b*d in both formats
            mult_result = str(vars["b"] * vars["d"])
            vars["b*d"] = mult_result
            vars["b·d"] = mult_result
        
        # Generate question
        try:
            if isinstance(question_template["question"], str):
                # For equation-based questions, we need to handle both LaTeX braces and the x variable
                if "x" in question_template["question"]:
                    # First escape all LaTeX curly braces by doubling them
                    temp_question = question_template["question"].replace("{", "{{").replace("}", "}}")
                    # Then replace x with a literal x (we've already escaped the braces)
                    temp_question = temp_question.replace("x", "x")
                    # Now replace back single braces for our format variables
                    formatted_vars = {k: v for k, v in vars.items() if k != "x"}
                    for var_name in formatted_vars.keys():
                        temp_question = temp_question.replace(f"{{{{{var_name}}}}}", f"{{{var_name}}}")
                    # Format the string
                    question = temp_question.format(**formatted_vars)
                else:
                    # For non-equation questions, just escape LaTeX braces
                    temp_question = question_template["question"].replace("{", "{{").replace("}", "}}")
                    # Replace back single braces for our format variables
                    for var_name in vars.keys():
                        temp_question = temp_question.replace(f"{{{{{var_name}}}}}", f"{{{var_name}}}")
                    question = temp_question.format(**vars)
            else:
                question = f"${vars['expression']}$"
        except KeyError as e:
            logger.error(f"Missing variable in question template: {str(e)}")
            raise
        
        # Get answers using the answer generator
        if "answer_generator" in question_template:
            answers = question_template["answer_generator"](vars)
            correct_answer = answers["correct"]
            wrong_answers = answers["wrong"]
        else:
            # Use template_vars for answers if answer_generator is missing
            if "correct" in vars and "wrong" in vars:
                correct_answer = vars["correct"]
                wrong_answers = vars["wrong"]
            else:
                # Fallback to basic answers if neither is available
                correct_answer = f"${vars.get('result', '0')}$"
                wrong_answers = [
                    f"${int(float(vars.get('result', 0))) + 1}$",
                    f"${int(float(vars.get('result', 0))) - 1}$",
                    f"${int(float(vars.get('result', 0))) * 2}$"
                ]
        
        # Ensure we have exactly 3 wrong answers
        while len(wrong_answers) < 3:
            if "result" in vars:
                base = float(vars['result']) if not callable(vars['result']) else float(vars['result'](vars))
                wrong_answers.append(f"${int(base + random.randint(-5, 5))}$")
            else:
                # Generate a reasonable wrong answer based on the variables
                base_val = next((v for v in vars.values() if isinstance(v, (int, float))), 0)
                wrong_answers.append(f"${int(base_val + random.randint(-5, 5))}$")
        wrong_answers = wrong_answers[:3]  # Trim to exactly 3 wrong answers
        
        # Generate explanation
        if "explanation_template" in question_template:
            if callable(question_template["explanation_template"]):
                explanation_template = question_template["explanation_template"](vars)
            else:
                explanation_template = question_template["explanation_template"]
            # Escape LaTeX curly braces
            explanation_template = explanation_template.replace("{", "{{").replace("}", "}}");
            # Replace back single braces for our format variables
            for var_name in vars.keys():
                explanation_template = explanation_template.replace(f"{{{{{var_name}}}}}", f"{{{var_name}}}")
            explanation = explanation_template.format(**vars)
        elif "explanation" in vars:
            explanation = vars["explanation"] if not callable(vars["explanation"]) else vars["explanation"](vars)
        else:
            # Provide a default explanation based on the question type
            explanation = f"Lös uppgiften steg för steg. Det korrekta svaret är {correct_answer}."
        
        # Shuffle answers
        all_answers = [correct_answer] + wrong_answers
        random.shuffle(all_answers)
        
        # Create question data following the required format
        question_data = {
            "id": str(uuid.uuid4()),
            "subject": question_template["subject"],
            "category": question_template["category"],
            "moment": delmoment,
            "difficulty": question_template["difficulty"],
            "question": question,
            "answers": all_answers,
            "correct_answer": correct_answer,
            "drawing": [],
            "explanation": explanation
        }
        
        logger.debug("Successfully created question data")
        return question_data
        
    except Exception as e:
        logger.error(f"Error generating question: {str(e)}", exc_info=True)
        raise

# ... rest of the code stays the same ... 