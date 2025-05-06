import random as rd
from api.v1.core.services.wrong_answer_generator import generate_linear_equation_choices
from api.v1.core.services.equation_generator import generate_linear_km

def linear_find_x(difficulty: int = 1, n = 5):
    """
    Generates a linear equation and returns the value of x
    
    Returns data needed for frontend graph visualization:
    - k: coefficient of x (slope)
    - m: y-intercept
    - x: solution value
    - y: right side of equation
    """
    equation = generate_linear_km()
    choices = generate_linear_equation_choices(equation)
    
    # Ensure k, m, x, and y values are not zero to avoid division by zero
    k = equation['k']
    m = equation['m']
    x = equation['x']
    y = equation['y']
    
    # Extra logging for debugging
    print(f"Linear find_x generated equation: k={k}, m={m}, x={x}, y={y}")
    print(f"Solution: x = {x}, which satisfies {k}x + {m} = {y}")
    print(f"Verification: {k} * {x} + {m} = {k*x + m} == {y}")
    
    # Generate the question string in format "kx + m = y" with proper spacing
    # Format the equation properly based on the sign of m
    if m >= 0:
        question_text = f"{k}x + {m} = {y}"
    else:
        question_text = f"{k}x - {abs(m)} = {y}"
    
    print(f"Final question text: '{question_text}'")
    
    # Ensure the moment is clearly identified for frontend detection
    return {
        "subject": "Mathematics",
        "category": "Linear Equations",
        "question": question_text,
        "answers": [f"{x}", f"{x + 1}", f"{x + 2}", f"{x + 3}"],
        "correct_answer": f"{x}",
        "explanation": "Video.mp4",
        "moment": "linear_find_x",  # Explicitly set the moment for frontend detection
        # Additional data for graph visualization
        "graph_data": {
            "k": k,
            "m": m,
            "x": x,
            "y": y
        }
    }

def linear_find_y(difficulty: int = 1, n = 5):
    """
    Generates a linear equation and returns the value of y
    
    Similar to linear_find_x, but asks for y value instead.
    Returns data needed for frontend graph visualization.
    """
    equation = generate_linear_km()
    
    # For find_y, we give x and ask for y
    given_x = equation['x']
    correct_y = equation['y']
    
    # Generate wrong answers that are close to correct answer
    wrong_answers = [
        correct_y + rd.randint(1, 3),
        correct_y - rd.randint(1, 3),
        correct_y + rd.randint(4, 6)
    ]
    
    # Shuffle answers
    all_answers = [str(correct_y)] + [str(ans) for ans in wrong_answers]
    rd.shuffle(all_answers)
    
    # Generate the question string with proper spacing
    question_text = f"If x = {given_x}, find y in the equation: {equation['k']}x {'+' if equation['m'] >= 0 else ''} {abs(equation['m'])} = y"
    
    return {
        "subject": "Mathematics",
        "category": "Linear Equations",
        "question": question_text,
        "answers": all_answers,
        "correct_answer": str(correct_y),
        "explanation": "Video.mp4",
        # Additional data for graph visualization
        "graph_data": {
            "k": equation['k'],
            "m": equation['m'],
            "x": given_x,
            "y": correct_y
        }
    }
