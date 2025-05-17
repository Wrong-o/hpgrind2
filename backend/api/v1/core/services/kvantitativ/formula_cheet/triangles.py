import random
import math
from fractions import Fraction
from api.v1.core.services.wrong_answer_generator import generate_math_choices

def _format_number(num, decimals=1):
    """Format number with given decimal places, removing trailing zeros if integer"""
    formatted = round(num, decimals)
    if formatted == int(formatted):
        return str(int(formatted))
    return str(formatted)

def _generate_triangle_data(points, triangle_type, labels=None):
    """
    Generate standardized triangle data for the frontend component
    
    Args:
        points: List of three [x, y] coordinate pairs
        triangle_type: The type of triangle ('right-angled', 'equilateral', 'isosceles', 'scalene')
        labels: Optional custom labels for vertices and sides
        
    Returns:
        Dictionary with triangle data formatted for the frontend
    """
    default_labels = {
        'point0': 'A',
        'point1': 'B',
        'point2': 'C',
        'side0': 'c',
        'side1': 'a',
        'side2': 'b'
    }
    
    triangle_data = {
        'points': points,
        'type': triangle_type,
        'labels': labels if labels else default_labels
    }
    
    # Calculate sides for reference (not returned)
    side_a = math.sqrt((points[2][0] - points[1][0])**2 + (points[2][1] - points[1][1])**2)
    side_b = math.sqrt((points[0][0] - points[2][0])**2 + (points[0][1] - points[2][1])**2)
    side_c = math.sqrt((points[1][0] - points[0][0])**2 + (points[1][1] - points[0][1])**2)
    
    # Store side lengths for question generation
    triangle_data['side_lengths'] = [side_a, side_b, side_c]
    
    return triangle_data

def triangle_sum_of_angles(difficulty: int = 1):
    """
    Generates a question where one angle is missing from a triangle
    
    Returns a question asking for a missing angle in a triangle,
    given that the sum of angles in a triangle is 180°
    """
    # Generate a random triangle - we'll use an isosceles triangle for simplicity
    # For difficulty levels, adjust the complexity of the angles
    
    base_width = random.randint(3, 6)
    height = random.randint(2, 5)
    
    # Create an isosceles triangle with coordinates
    points = [[0, 0], [base_width, 0], [base_width/2, height]]
    
    # Calculate the angles
    # For an isosceles triangle, two angles are equal
    # Using basic trigonometry to calculate angles
    base_angle = math.degrees(math.atan(height / (base_width/2)))
    top_angle = 180 - (2 * base_angle)
    
    # Round angles to whole numbers for simplicity
    base_angle = round(base_angle)
    top_angle = round(top_angle)
    
    # Adjust to ensure angles sum to 180
    if 2 * base_angle + top_angle != 180:
        top_angle = 180 - 2 * base_angle
    
    # Randomly choose which angle to ask for
    missing_position = random.choice([0, 1, 2])
    
    # For difficulty 2+, use more complex angles
    if difficulty >= 2:
        # Create a scalene triangle
        points = [[0, 0], [random.randint(3, 7), 0], [random.randint(1, 5), random.randint(2, 6)]]
        
        # For a scalene triangle, calculate sides
        a = math.sqrt((points[1][0] - points[2][0])**2 + (points[1][1] - points[2][1])**2)
        b = math.sqrt((points[0][0] - points[2][0])**2 + (points[0][1] - points[2][1])**2)
        c = math.sqrt((points[0][0] - points[1][0])**2 + (points[0][1] - points[1][1])**2)
        
        # Calculate angles using the law of cosines
        angle_A = math.degrees(math.acos((b**2 + c**2 - a**2) / (2*b*c)))
        angle_B = math.degrees(math.acos((a**2 + c**2 - b**2) / (2*a*c)))
        angle_C = 180 - angle_A - angle_B
        
        # Round the angles for simplicity
        angle_A = round(angle_A)
        angle_B = round(angle_B)
        angle_C = 180 - angle_A - angle_B  # Ensure they sum to 180
        
        angles = [angle_A, angle_B, angle_C]
        missing_position = random.randint(0, 2)
    else:
        angles = [base_angle, base_angle, top_angle]
    
    # Set up the question
    missing_angle = angles[missing_position]
    known_angles = [angles[i] for i in range(3) if i != missing_position]
    
    question_text = f"Find the missing angle in the triangle where the other angles are {known_angles[0]}° and {known_angles[1]}°."
    correct_answer = str(missing_angle)
    
    # Generate wrong answers
    wrong_answers = []
    
    # Common mistake: forgetting angles sum to 180
    wrong_sum = 360 - known_angles[0] - known_angles[1]
    if abs(wrong_sum - missing_angle) > 5:  # Only use if significantly different
        wrong_answers.append(str(wrong_sum))
    
    # Common mistake: assuming the triangle is equilateral
    if abs(60 - missing_angle) > 5:  # Only use if significantly different
        wrong_answers.append("60")
    
    # Common mistake: assuming the triangle is right-angled
    if abs(90 - missing_angle) > 5:  # Only use if significantly different
        wrong_answers.append("90")
    
    # Add some random variations
    while len(wrong_answers) < 3:
        wrong = missing_angle + random.choice([10, -10, 5, -5, 15, -15])
        if wrong > 0 and wrong < 180 and str(wrong) not in wrong_answers and wrong != missing_angle:
            wrong_answers.append(str(wrong))
    
    # Determine triangle type
    triangle_type = 'isosceles' if difficulty < 2 else 'scalene'
    
    # Generate triangle data for the frontend
    triangle_data = _generate_triangle_data(points, triangle_type)
    
    # Missing angle index corresponds to which vertex
    missing_vertex = ['A', 'B', 'C'][missing_position]
    
    return {
        "subject": "Mathematics",
        "category": "Triangles",
        "question": question_text,
        "answers": [correct_answer] + wrong_answers[:3],
        "correct_answer": correct_answer,
        "explanation": "Video.mp4",
        "moment": "triangles_vinkelsumma",
        "triangle_data": triangle_data,
        "missing_angle_vertex": missing_vertex
    }

def triangle_pythagoras(difficulty: int = 1):
    """
    Generates a question about the Pythagorean theorem
    
    Creates a right-angled triangle and asks for the length of one side
    using the Pythagorean theorem (a² + b² = c²)
    """
    # For difficulty 1: Use Pythagorean triplets for nice integer values
    pythagorean_triplets = [
        (3, 4, 5),
        (5, 12, 13),
        (8, 15, 17),
        (7, 24, 25)
    ]
    
    if difficulty == 1:
        # Use a basic Pythagorean triplet
        base, height, hypotenuse = random.choice(pythagorean_triplets)
        
        # Scale the triplet for variety (only if difficulty=1)
        if random.choice([True, False]):
            multiplier = random.randint(1, 3)
            base *= multiplier
            height *= multiplier
            hypotenuse *= multiplier
    else:
        # For higher difficulty, use non-integer values
        base = random.randint(3, 10)
        height = random.randint(3, 10)
        hypotenuse = math.sqrt(base**2 + height**2)
    
    # Create points for a right-angled triangle
    points = [[0, 0], [base, 0], [0, height]]
    
    # Randomly decide which side to ask for
    missing_side_index = random.randint(0, 2)
    sides = [base, height, hypotenuse]
    missing_side = sides[missing_side_index]
    
    # Create labels based on which side is missing
    if missing_side_index == 0:  # base
        question_text = f"Find the length of side a in the right-angled triangle where b = {_format_number(height)} and c = {_format_number(hypotenuse)}."
        formula_hint = "Use the Pythagorean theorem: a² + b² = c²"
    elif missing_side_index == 1:  # height
        question_text = f"Find the length of side b in the right-angled triangle where a = {_format_number(base)} and c = {_format_number(hypotenuse)}."
        formula_hint = "Use the Pythagorean theorem: a² + b² = c²"
    else:  # hypotenuse
        question_text = f"Find the length of the hypotenuse (side c) in the right-angled triangle where a = {_format_number(base)} and b = {_format_number(height)}."
        formula_hint = "Use the Pythagorean theorem: a² + b² = c²"
    
    # Format the correct answer
    correct_answer = _format_number(missing_side)
    
    # Generate wrong answers
    wrong_answers = []
    
    # Common mistake: adding instead of squaring
    if missing_side_index == 2:  # hypotenuse
        wrong_addition = base + height
        wrong_answers.append(_format_number(wrong_addition))
    elif missing_side_index == 0:  # base
        wrong_addition = abs(hypotenuse - height)
        wrong_answers.append(_format_number(wrong_addition))
    else:  # height
        wrong_addition = abs(hypotenuse - base)
        wrong_answers.append(_format_number(wrong_addition))
    
    # Add random variations
    variations = [0.9, 1.1, 0.8, 1.2]
    while len(wrong_answers) < 3:
        variation = random.choice(variations)
        wrong = missing_side * variation
        wrong_formatted = _format_number(wrong)
        if wrong_formatted not in wrong_answers and wrong_formatted != correct_answer:
            wrong_answers.append(wrong_formatted)
            variations.remove(variation)
    
    # Generate triangle data for the frontend
    triangle_data = _generate_triangle_data(
        points, 
        'right-angled', 
        {
            'point0': 'A',
            'point1': 'B',
            'point2': 'C',
            'side0': 'c',  # hypotenuse
            'side1': 'a',  # base
            'side2': 'b',  # height
        }
    )
    
    return {
        "subject": "Mathematics",
        "category": "Triangles",
        "question": question_text,
        "answers": [correct_answer] + wrong_answers[:3],
        "correct_answer": correct_answer,
        "explanation": "Video.mp4",
        "moment": "triangles_pythagoras",
        "triangle_data": triangle_data,
        "formula_hint": formula_hint
    }

def triangle_area(difficulty: int = 1):
    """
    Generates a question about the area of a triangle
    
    Creates a triangle and asks for its area using the formula Area = (1/2) × base × height
    """
    # For difficulty 1: Use simple integers
    base = random.randint(4, 10)
    height = random.randint(3, 8)
    
    # For higher difficulty: Use decimal values or more complex triangles
    if difficulty >= 2:
        # Add some decimal places
        base = base + round(random.random(), 1)
        height = height + round(random.random(), 1)
    
    # Create points for the triangle
    points = [[0, 0], [base, 0], [random.randint(int(base/4), int(3*base/4)), height]]
    
    # Calculate the area
    area = 0.5 * base * height
    
    # Format area to appropriate precision
    if difficulty == 1:
        area_formatted = _format_number(area, 0)
    else:
        area_formatted = _format_number(area, 1)
    
    # Determine triangle type based on points
    # Check if right-angled
    side_a = math.sqrt((points[1][0] - points[2][0])**2 + (points[1][1] - points[2][1])**2)
    side_b = math.sqrt((points[0][0] - points[2][0])**2 + (points[0][1] - points[2][1])**2)
    side_c = math.sqrt((points[1][0] - points[0][0])**2 + (points[1][1] - points[0][1])**2)
    
    is_right = False
    precision = 0.01
    if (abs(side_a**2 + side_b**2 - side_c**2) < precision or
        abs(side_a**2 + side_c**2 - side_b**2) < precision or
        abs(side_b**2 + side_c**2 - side_a**2) < precision):
        is_right = True
        triangle_type = 'right-angled'
    else:
        triangle_type = 'scalene'
    
    # Create the question text
    if is_right:
        question_text = f"Calculate the area of this right-angled triangle with base {_format_number(base)} units and height {_format_number(height)} units."
    else:
        question_text = f"Calculate the area of this triangle with base {_format_number(base)} units and height {_format_number(height)} units."
    
    # Generate wrong answers
    wrong_answers = []
    
    # Common mistake: not dividing by 2
    full_area = base * height
    wrong_answers.append(_format_number(full_area))
    
    # Common mistake: using the perimeter formula
    perimeter = side_a + side_b + side_c
    if abs(perimeter - area) > 1:  # Only add if significantly different
        wrong_answers.append(_format_number(perimeter))
    
    # Common mistake: adding base and height
    sum_base_height = base + height
    if abs(sum_base_height - area) > 1:  # Only add if significantly different
        wrong_answers.append(_format_number(sum_base_height))
    
    # Add some random variations
    while len(wrong_answers) < 3:
        variation = random.choice([0.5, 1.5, 2, 3])
        wrong = area * variation
        wrong_formatted = _format_number(wrong, 1)
        if wrong_formatted not in wrong_answers and wrong_formatted != area_formatted:
            wrong_answers.append(wrong_formatted)
    
    # Generate triangle data for the frontend
    triangle_data = _generate_triangle_data(points, triangle_type)
    
    return {
        "subject": "Mathematics",
        "category": "Triangles",
        "question": question_text,
        "answers": [area_formatted] + wrong_answers[:3],
        "correct_answer": area_formatted,
        "explanation": "Video.mp4",
        "moment": "triangles_area",
        "triangle_data": triangle_data,
        "formula_hint": "Area = (1/2) × base × height"
    }