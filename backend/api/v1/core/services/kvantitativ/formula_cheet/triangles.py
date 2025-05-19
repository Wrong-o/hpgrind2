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

def _generate_triangle_data(points, triangle_type, labels=None, angles=None, missing_angle_vertex=None):
    """
    Generate standardized triangle data for the frontend component
    
    Args:
        points: List of three [x, y] coordinate pairs
        triangle_type: The type of triangle ('right-angled', 'equilateral', 'isosceles', 'scalene')
        labels: Optional custom labels for vertices and sides
        angles: Optional list of angles in the triangle
        missing_angle_vertex: Optional vertex of the missing angle
        
    Returns:
        Dictionary with triangle data formatted for the frontend
    """
    print(f"_generate_triangle_data called with: triangle_type={triangle_type}, angles={angles}, missing_angle_vertex={missing_angle_vertex}")
    
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
    
    # Calculate sides for reference
    side_a = math.sqrt((points[2][0] - points[1][0])**2 + (points[2][1] - points[1][1])**2)
    side_b = math.sqrt((points[0][0] - points[2][0])**2 + (points[0][1] - points[2][1])**2)
    side_c = math.sqrt((points[1][0] - points[0][0])**2 + (points[1][1] - points[0][1])**2)
    
    # Store side lengths for question generation
    triangle_data['side_lengths'] = [side_a, side_b, side_c]
    
    # If angles are provided, use them directly
    if angles is not None:
        print(f"Using provided angles: {angles}")
        triangle_data['angles'] = angles
        
        # Add the missing angle vertex information if provided
        if missing_angle_vertex is not None:
            triangle_data['missing_angle_vertex'] = missing_angle_vertex
            print(f"Added missing_angle_vertex: {missing_angle_vertex} to triangle_data")
        
        # Skip the angle calculation part
        print(f"Final triangle_data with provided angles: {triangle_data}")
        return triangle_data
    
    # If angles are not provided, calculate them using the law of cosines
    print("No angles provided, calculating them from points")
    
    # Calculate angles using the law of cosines
    # Angle A (between sides b and c)
    angle_A = math.degrees(math.acos((side_b**2 + side_c**2 - side_a**2) / (2 * side_b * side_c)))
    # Angle B (between sides a and c)
    angle_B = math.degrees(math.acos((side_a**2 + side_c**2 - side_b**2) / (2 * side_a * side_c)))
    # Angle C (between sides a and b)
    angle_C = 180 - angle_A - angle_B  # Ensure they sum to 180
    
    # Round angles to integers
    angle_A = round(angle_A)
    angle_B = round(angle_B)
    angle_C = round(angle_C)
    
    # Adjust angles based on triangle type
    if triangle_type == 'right-angled':
        # Find which angle is closest to 90 degrees
        angles = [angle_A, angle_B, angle_C]
        diffs = [abs(angle - 90) for angle in angles]
        right_angle_index = diffs.index(min(diffs))
        
        # Set the right angle to exactly 90 degrees
        angles[right_angle_index] = 90
        
        # Adjust other angles to ensure sum is 180
        if right_angle_index == 0:
            # If angle A is 90, adjust B and C
            sum_BC = angles[1] + angles[2]
            if sum_BC != 90:
                scale_factor = 90 / sum_BC
                angles[1] = round(angles[1] * scale_factor)
                angles[2] = 90 - angles[1]
        elif right_angle_index == 1:
            # If angle B is 90, adjust A and C
            sum_AC = angles[0] + angles[2]
            if sum_AC != 90:
                scale_factor = 90 / sum_AC
                angles[0] = round(angles[0] * scale_factor)
                angles[2] = 90 - angles[0]
        else:
            # If angle C is 90, adjust A and B
            sum_AB = angles[0] + angles[1]
            if sum_AB != 90:
                scale_factor = 90 / sum_AB
                angles[0] = round(angles[0] * scale_factor)
                angles[1] = 90 - angles[0]
        
        angle_A, angle_B, angle_C = angles
    else:
        # For non-right triangles, ensure angles sum to exactly 180
        sum_angles = angle_A + angle_B + angle_C
        if sum_angles != 180:
            # Adjust the largest angle to ensure sum is 180
            if angle_A >= angle_B and angle_A >= angle_C:
                angle_A = 180 - angle_B - angle_C
            elif angle_B >= angle_A and angle_B >= angle_C:
                angle_B = 180 - angle_A - angle_C
            else:
                angle_C = 180 - angle_A - angle_B
    
    # Store angles in triangle data
    triangle_data['angles'] = angles
    
    return triangle_data

def triangle_sum_of_angles(difficulty=1):
    """
    Generate a question about a missing angle in a triangle.
    The user is given two angles and asked to find the third one.
    """
    print(f"Starting triangle_sum_of_angles with difficulty: {difficulty}")
    
    triangle_type = random.choice(['isosceles', 'scalene']) if difficulty > 1 else 'isosceles'
    print(f"Selected triangle type: {triangle_type}")
    
    if triangle_type == 'isosceles':
        # For isosceles triangle, two angles are equal
        equal_angle = random.randint(30, 75)  # Ensure reasonable angles
        third_angle = 180 - 2 * equal_angle
        
        # Randomly decide which angle to ask for
        missing_index = random.randint(0, 2)
        print(f"Isosceles triangle - equal_angle: {equal_angle}, third_angle: {third_angle}, missing_index: {missing_index}")
        
        if missing_index == 0:  # Ask for third angle
            known_angles = [equal_angle, equal_angle]
            missing_angle = third_angle
            missing_angle_vertex = 'C'  # The non-equal angle is at vertex C
            angles = [third_angle, equal_angle, equal_angle]  # In order A, B, C
        elif missing_index == 1:  # Ask for one of the equal angles
            known_angles = [equal_angle, third_angle]
            missing_angle = equal_angle
            missing_angle_vertex = 'A'  # One of the equal angles is at vertex A
            angles = [equal_angle, equal_angle, third_angle]  # In order A, B, C
        else:  # Ask for the other equal angle
            known_angles = [equal_angle, third_angle]
            missing_angle = equal_angle
            missing_angle_vertex = 'B'  # The other equal angle is at vertex B
            angles = [equal_angle, equal_angle, third_angle]  # In order A, B, C
        
        # Generate triangle data
        # For isosceles triangle, make a triangle with base along x-axis
        base = random.randint(3, 8)
        height = random.randint(2, 6)
        points = [[0, 0], [base, 0], [base/2, height]]
        
    else:  # scalene triangle
        # Generate three angles that sum to 180
        angle_a = random.randint(30, 60)
        angle_b = random.randint(30, 60)
        angle_c = 180 - angle_a - angle_b
        
        # Randomly decide which angle to ask for
        missing_index = random.randint(0, 2)
        print(f"Scalene triangle - angle_a: {angle_a}, angle_b: {angle_b}, angle_c: {angle_c}, missing_index: {missing_index}")
        
        if missing_index == 0:
            known_angles = [angle_b, angle_c]
            missing_angle = angle_a
            missing_angle_vertex = 'A'
            angles = [angle_a, angle_b, angle_c]  # In order A, B, C
        elif missing_index == 1:
            known_angles = [angle_a, angle_c]
            missing_angle = angle_b
            missing_angle_vertex = 'B'
            angles = [angle_a, angle_b, angle_c]  # In order A, B, C
        else:
            known_angles = [angle_a, angle_b]
            missing_angle = angle_c
            missing_angle_vertex = 'C'
            angles = [angle_a, angle_b, angle_c]  # In order A, B, C
        
        # Generate triangle data - make a scalene triangle
        # Use law of sines to calculate side lengths
        sin_a = math.sin(math.radians(angle_a))
        sin_b = math.sin(math.radians(angle_b))
        sin_c = math.sin(math.radians(angle_c))
        
        # Set one side length and calculate others
        side_c = random.randint(3, 8)  # Side c (opposite to angle C)
        side_a = side_c * sin_a / sin_c
        side_b = side_c * sin_b / sin_c
        
        # Convert to x,y coordinates
        # Place point A at origin, point B at (side_c, 0)
        # Calculate point C position using law of cosines
        cos_a = math.cos(math.radians(angle_a))
        x_c = side_b * cos_a
        y_c = side_b * math.sin(math.radians(angle_a))
        
        points = [[0, 0], [side_c, 0], [x_c, y_c]]
    
    print(f"Final angles array: {angles}")
    print(f"Missing angle vertex: {missing_angle_vertex}, Missing angle value: {missing_angle}")
    print(f"Triangle points: {points}")
    
    # For triangle_sum_of_angles, we want to ensure the angles array in triangle_data
    # corresponds exactly to [angle_A, angle_B, angle_C]
    triangle_data = _generate_triangle_data(
        points=points, 
        triangle_type=triangle_type,
        angles=angles,  # Explicitly pass the angles array in the correct order
        missing_angle_vertex=missing_angle_vertex
    )
    
    # Generate wrong answers based on common misconceptions
    wrong_answers = []
    
    # Common mistake: forgetting that angles sum to 180
    wrong_answers.append(_format_number(missing_angle + random.randint(5, 15)))
    
    # Common mistake: subtracting the known angles incorrectly
    wrong_answers.append(_format_number(abs(known_angles[0] - known_angles[1])))
    
    # Another common mistake: adding the known angles
    wrong_answers.append(_format_number(known_angles[0] + known_angles[1]))
    
    # Random wrong answer within a reasonable range
    random_wrong = missing_angle + random.randint(-10, 10)
    while random_wrong == missing_angle or random_wrong <= 0 or random_wrong >= 180:
        random_wrong = missing_angle + random.randint(-10, 10)
    wrong_answers.append(_format_number(random_wrong))
    
    # Construct the question text
    question_text = f"In the triangle above, angles {missing_angle_vertex != 'A' and 'A' or 'B'} = {_format_number(known_angles[0])}° and {missing_angle_vertex != 'C' and 'C' or 'B'} = {_format_number(known_angles[1])}°. Find the measure of angle {missing_angle_vertex}."
    
    # Return the formatted question data
    return {
        "question_text": question_text,
        "correct_answer": str(_format_number(missing_angle)) + "°",
        "wrong_answers": [str(ans) + "°" for ans in wrong_answers],
        "triangle_data": triangle_data,
        "hint": "Remember that the sum of angles in a triangle is 180°."
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
    
    # Calculate the angles precisely for a right-angled triangle
    # The angle at point C (corner) is 90 degrees
    angle_C = 90
    
    # Calculate the other angles using trigonometry
    # We know the opposite and adjacent sides, so we can use arctan
    angle_A = math.degrees(math.atan(height / base))
    angle_B = 180 - 90 - angle_A
    
    # Round to whole numbers
    angle_A = round(angle_A)
    angle_B = round(angle_B)
    
    # Ensure angles add up to 180 exactly
    if angle_A + angle_B + angle_C != 180:
        angle_B = 180 - 90 - angle_A
    
    # Override the angles in triangle_data
    triangle_data['angles'] = [angle_A, angle_B, angle_C]
    
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
    
    # Calculate the angles
    # Angle A (between sides b and c)
    angle_A = math.degrees(math.acos((side_b**2 + side_c**2 - side_a**2) / (2 * side_b * side_c)))
    # Angle B (between sides a and c)
    angle_B = math.degrees(math.acos((side_a**2 + side_c**2 - side_b**2) / (2 * side_a * side_c)))
    # Angle C (between sides a and b)
    angle_C = 180 - angle_A - angle_B  # Ensure they sum to 180
    
    # Round angles to integers
    angle_A = round(angle_A)
    angle_B = round(angle_B)
    
    # Special handling for right-angled triangles
    if is_right:
        # Find which angle is closest to 90 degrees
        angles = [angle_A, angle_B, angle_C]
        diffs = [abs(angle - 90) for angle in angles]
        right_angle_index = diffs.index(min(diffs))
        
        # Set that angle to exactly 90
        angles[right_angle_index] = 90
        
        # Recalculate the other angles to ensure they sum to 180
        if right_angle_index == 0:
            # A is 90, adjust B and C
            angle_B = angles[1]
            angle_C = 180 - 90 - angle_B
        elif right_angle_index == 1:
            # B is 90, adjust A and C
            angle_A = angles[0]
            angle_C = 180 - 90 - angle_A
        else:
            # C is 90, adjust A and B
            angle_A = angles[0]
            angle_B = 180 - 90 - angle_A
    else:
        # Make sure C is updated to maintain sum of 180
        angle_C = 180 - angle_A - angle_B
    
    # Override the angles in triangle_data
    triangle_data['angles'] = [angle_A, angle_B, angle_C]
    
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