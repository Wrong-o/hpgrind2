import random
from typing import List, Dict, Union
from pydantic import BaseModel
import math
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: str
    equation_parts: Dict[str, Union[str, int, None]]  # Added None as possible type

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
            question = f"What is the exponent when simplifying: {base}^{a} * {base}^{b}?"
            latex_operation = "\\cdot"
        else:
            correct = a - b
            question = f"What is the exponent when simplifying: {base}^{a} / {base}^{b}?"
            latex_operation = "\\div"
        
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
            question=f"What is the exponent when simplifying: {base}^{{{a}}} {latex_operation} {base}^{{{b}}}?",
            options=[str(x) for x in all_answers],
            correct_answer=str(correct),
            equation_parts={
                "base": base,
                "exponent1": a,
                "exponent2": b,
                "operation": operation
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

def generate_math_question() -> QuizQuestion:
    # Randomly choose which type of question to generate
    question_type = random.choice([
        'basic_math',
        'power_rules',
        'pythagoras'
    ])
    
    try:
        logger.info(f"Generating {question_type} question")
        if question_type == 'basic_math':
            return generate_basic_math_question()
        elif question_type == 'power_rules':
            return generate_power_rule_question()
        else:  # pythagoras
            return generate_pythagoras_question()
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