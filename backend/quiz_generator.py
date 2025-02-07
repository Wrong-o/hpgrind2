import random
from typing import List, Dict, Union
from pydantic import BaseModel
import math
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class QuizQuestion:
    def __init__(self, question: str, options: List[str], correct_answer: str, 
                 equation_parts: Dict = None, subcategory: str = "", 
                 difficulty: int = 1, explanation: str = ""):
        self.question = question
        self.options = options
        self.correct_answer = correct_answer
        self.equation_parts = equation_parts or {}
        self.subcategory = subcategory
        self.difficulty = difficulty  # 1-5 scale
        self.explanation = explanation

XYZ_QUESTIONS = [
    {
        "question": "Vilket svarsalternativ motsvarar uttrycket x² - 6x + 5?",
        "options": ["(x+5)(x-1)", "(x-1)(x-5)", "(x-2)(x-3)", "(x+3)(x-2)"],
        "correct_answer": "(x-2)(x-3)",
        "subcategory": "Kvadreringsformler",
        "difficulty": 2,
        "explanation": "För att faktorisera x² - 6x + 5, leta efter två tal som:\n"
                      "1. Har summan -6 (koefficienten för x)\n"
                      "2. Har produkten 5 (den konstanta termen)\n"
                      "Talen är -2 och -3, därför blir faktoriseringen (x-2)(x-3)"
    },
    {
        "question": "x + y = 10 Medelvärdet av Y och 0 är lika med 5. Vilket värde har x?",
        "options": ["0", "5", "-5", "10"],
        "correct_answer": "0",
        "subcategory": "Medelvärde",
        "difficulty": 3,
        "explanation": "1. Medelvärdet av Y och 0 är 5, alltså: (Y + 0)/2 = 5\n"
                      "2. Lös ut Y: Y = 10\n"
                      "3. Från första ekvationen: x + 10 = 10\n"
                      "4. Därför är x = 0"
    },
    {
        "question": "a och b är positiva tal. Vilket svarsalternativ är lösnignen till ekvationen ax + bx = 1?",
        "options": ["x = a+b", "x = 1/ab", "x = 1- (a+b)", "x = 1/(a+b)"],
        "correct_answer": "x = 1/(a+b)",
        "subcategory": "Ekvationer"
    },
    {
        "question": "Vilket svarsalternativ är lika med 18 procent av 2/5?",
        "options": ["9/250", "1/45", "9/125", "4/45"],
        "correct_answer": "9/125",
        "subcategory": "Procent"
    },
    {
        "question": "Ritva har sex bollar som hon fördelar slumpmässigt i tre tomma lådor. Hur stor är sannolikheten att exakt en låda innehåller ett udda antal bollar när Ritva är klar?",
        "options": ["1/3", "2/3", "0", "1"],
        "correct_answer": "0",
        "subcategory": "Sannolikhet"
    },
    {
        "question": "Vad blir x1/y1/x2/y2 om x1= 2x2 och y1= 2y2?",
        "options": ["x1/y1", "1", "2", "2x/y2"],
        "correct_answer": "1",
        "subcategory": "Förenklingar"
    }
]

def generate_power_rule_question() -> QuizQuestion:
    try:
        operations = ['*', '/']
        operation = random.choice(operations)
        
        # Generate reasonable exponents
        a = random.randint(-5, 8)
        b = random.randint(-5, 8)
        
        base = random.choice(['x', '2', '3', '5'])
        
        if operation == '*':
            correct = a + b
            question = f"What is the exponent when simplifying: {base}^{{{a}}} \\cdot {base}^{{{b}}}"
        else:
            correct = a - b
            # Format division as LaTeX fraction without escaping
            question = f"What is the exponent when simplifying: \\frac{{{base}^{{{a}}}}}{{{base}^{{{b}}}}}"
        
        # Generate wrong answers that are plausible mistakes
        wrong_answers = set()
        common_mistakes = [
            a * b,  # Common mistake: multiplying exponents
            abs(a - b) if operation == '/' else abs(a + b),  # Forgetting negative
            -correct,  # Sign error
            (a + b if operation == '/' else a - b)  # Mixing up the rules
        ]
        
        wrong_answers.update([x for x in common_mistakes if x != correct])
        
        while len(wrong_answers) < 3:
            wrong = correct + random.randint(-2, 2)
            if wrong != correct:
                wrong_answers.add(wrong)
        
        all_answers = list(wrong_answers)[:3] + [correct]
        random.shuffle(all_answers)
        
        return QuizQuestion(
            question=question,
            options=[str(x) for x in all_answers],
            correct_answer=str(correct),
            equation_parts={
                "base": base,
                "exponent1": a,
                "exponent2": b,
                "operation": operation,
                "latex": question  # Add the raw LaTeX
            }
        )
    except Exception as e:
        logger.error(f"Error in power rule question: {str(e)}")
        raise

def generate_pythagoras_question() -> QuizQuestion:
    try:
        triples = [
            (3, 4, 5),
            (5, 12, 13),
            (6, 8, 10)
        ]
        
        triple = random.choice(triples)
        scale = random.choice([1, 1, 2])
        a, b, c = [x * scale for x in triple]
        
        missing_side = random.choice(['a', 'b', 'c'])
        
        # Create equation parts with all values, setting only the missing one to None
        equation_parts = {
            "a": a if missing_side != 'a' else None,
            "b": b if missing_side != 'b' else None,
            "c": c if missing_side != 'c' else None,
            "missing_side": missing_side
        }

        # Debug log
        print(f"Generated triangle data: {equation_parts}")
        
        if missing_side == 'c':
            question = f"Find the hypotenuse (c) of the right triangle."
            correct = c
        elif missing_side == 'a':
            question = f"Find side a of the right triangle."
            correct = a
        else:
            question = f"Find side b of the right triangle."
            correct = b
        
        # Generate wrong answers that are plausible mistakes
        wrong_answers = set()
        mistakes = [
            correct + random.randint(1, 3),
            correct - random.randint(1, 3),
            round(correct * 1.1),
            round(correct * 0.9)
        ]
        
        wrong_answers.update([x for x in mistakes if x != correct and x > 0])
        
        while len(wrong_answers) < 3:
            wrong = correct + random.randint(-3, 3)
            if wrong != correct and wrong > 0:
                wrong_answers.add(wrong)
        
        all_answers = list(wrong_answers)[:3] + [correct]
        random.shuffle(all_answers)
        
        return QuizQuestion(
            question=question,
            options=[str(x) for x in all_answers],
            correct_answer=str(correct),
            equation_parts=equation_parts
        )
    except Exception as e:
        logger.error(f"Error in pythagoras question: {str(e)}")
        raise

def generate_xyz_question() -> QuizQuestion:
    question_data = random.choice(XYZ_QUESTIONS)
    return QuizQuestion(
        question=question_data["question"],
        options=question_data["options"],
        correct_answer=question_data["correct_answer"],
        subcategory=question_data["subcategory"],
        difficulty=question_data["difficulty"],
        explanation=question_data["explanation"]
    )

def generate_math_question() -> QuizQuestion:
    # Randomly choose which type of question to generate
    question_type = random.choice([
        'basic_math',
        'power_rules',
        'pythagoras',
        'xyz'
    ])
    
    try:
        logger.info(f"Generating {question_type} question")
        if question_type == 'basic_math':
            return generate_basic_math_question()
        elif question_type == 'power_rules':
            return generate_power_rule_question()
        elif question_type == 'pythagoras':
            return generate_pythagoras_question()
        else:  # xyz
            return generate_xyz_question()
    except Exception as e:
        logger.error(f"Error generating {question_type} question: {str(e)}")
        # Fallback to basic math question if others fail
        return generate_basic_math_question()

def generate_basic_math_question() -> QuizQuestion:
    try:
        operations = ['+', '-', '*']
        operation = random.choice(operations)
        
        if operation == '+':
            num1 = random.randint(1, 100)
            num2 = random.randint(1, 100)
            correct = num1 + num2
        elif operation == '-':
            num1 = random.randint(1, 100)
            num2 = random.randint(1, num1)
            correct = num1 - num2
        else:
            num1 = random.randint(1, 12)
            num2 = random.randint(1, 12)
            correct = num1 * num2

        wrong_answers = set()
        while len(wrong_answers) < 3:
            if operation == '*':
                wrong = correct + random.randint(-5, 5)
            else:
                wrong = correct + random.randint(-10, 10)
            if wrong != correct and wrong > 0:
                wrong_answers.add(wrong)

        all_answers = list(wrong_answers) + [correct]
        random.shuffle(all_answers)
        
        return QuizQuestion(
            question=f"What is {num1} {operation} {num2}?",
            options=[str(x) for x in all_answers],
            correct_answer=str(correct),
            equation_parts={
                "num1": num1,
                "num2": num2,
                "operation": operation
            }
        )
    except Exception as e:
        logger.error(f"Error in basic math question: {str(e)}")
        raise

def generate_quiz_questions(count: int = 12) -> List[QuizQuestion]:
    return [generate_math_question() for _ in range(count)] 