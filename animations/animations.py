from manim import *


class FractionMultiplication(MovingCameraScene):
    def construct(self):
        # Initial equation
        self.camera.frame.scale(0.4)
        equation = MathTex(r"\frac{5}{3} \times \frac{4}{6} = x")
        self.play(Write(equation))
        self.wait(1)

        # Create copies of the numbers to highlight
        five = equation[0][0]  # First character in the first fraction
        three = equation[0][2]  # Third character in the first fraction
        four = equation[0][4]  # Fifth character (after the times symbol)
        six = equation[0][6]   # Seventh character

        # Highlight the parts that will be multiplied
        self.play(
            five.animate.set_color(BLUE),
            three.animate.set_color(BLUE),
            four.animate.set_color(RED),
            six.animate.set_color(RED)
        )
        self.wait(0.5)

        # Create the intermediate step with pre-colored numbers
        intermediate = MathTex(r"\frac{5 \times 4}{3 \times 6} = x")

        # Pre-color the numbers in the intermediate step before showing it
        intermediate[0][0].set_color(BLUE)  # 5
        intermediate[0][2].set_color(RED)   # 4
        intermediate[0][4].set_color(BLUE)  # 3
        intermediate[0][6].set_color(RED)   # 6

        # Fade out the first equation and fade in the intermediate step
        self.play(
            FadeOut(equation, run_time=0.5),
            FadeIn(intermediate, run_time=0.5)
        )
        self.wait(1)

        # Create copies of the parts to be multiplied
        numerator_part = intermediate[0][:3].copy()  # "5 × 4"
        denominator_part = intermediate[0][4:7].copy()  # "3 × 6"

        # Move the copies to positions above and below the fraction, but still visible
        self.play(
            numerator_part.animate.shift(intermediate.get_center() + UP / 2),
            denominator_part.animate.shift(
                intermediate.get_center() + DOWN / 2)
        )
        self.wait(0.5)

        # Show the multiplication happening
        numerator_calc = MathTex(r"5 \times 4 = 20")
        denominator_calc = MathTex(r"3 \times 6 = 18")

        # Position the calculations at the same positions as the parts
        numerator_calc.move_to(numerator_part.get_center())
        denominator_calc.move_to(denominator_part.get_center())

        # Pre-color the numbers in the calculations
        numerator_calc[0][0].set_color(BLUE)   # 5
        numerator_calc[0][2].set_color(RED)    # 4
        denominator_calc[0][0].set_color(BLUE)  # 3
        denominator_calc[0][2].set_color(RED)  # 6

        # Replace the copies with the full calculations
        self.play(
            ReplacementTransform(numerator_part, numerator_calc),
            ReplacementTransform(denominator_part, denominator_calc)
        )
        self.wait(1)

        # Draw arrows pointing back to the fraction
        arrow_up = Arrow(numerator_calc.get_bottom(),
                         intermediate[0][0:3].get_top(), buff=0.2, color=YELLOW)
        arrow_down = Arrow(denominator_calc.get_top(
        ), intermediate[0][4:7].get_bottom(), buff=0.2, color=YELLOW)

        self.play(
            Create(arrow_up),
            Create(arrow_down)
        )
        self.wait(0.5)

        # Final calculated result
        calculated_equation = MathTex(r"\frac{20}{18} = x")

        # Fade out the calculation steps and arrows
        self.play(
            FadeOut(numerator_calc),
            FadeOut(denominator_calc),
            FadeOut(arrow_up),
            FadeOut(arrow_down)
        )

        # Fade out intermediate and fade in result
        self.play(
            FadeOut(intermediate, run_time=0.5),
            FadeIn(calculated_equation, run_time=0.5)
        )
        self.wait(1)

        # Simplify the fraction
        simplified = MathTex(r"\frac{10}{9} = x")

        # Show the simplification process
        self.play(
            calculated_equation[0][0:2].animate.set_color(YELLOW),  # 20
            calculated_equation[0][3:5].animate.set_color(YELLOW)   # 18
        )
        self.wait(0.5)

        # Add division explanation
        division_text = Text("÷ 2", font_size=24).next_to(
            calculated_equation, LEFT)
        self.play(Write(division_text))
        self.wait(0.5)

        # Fade transition to simplified
        self.play(
            FadeOut(calculated_equation),
            FadeOut(division_text),
            FadeIn(simplified)
        )
        self.wait(1)

        # Highlight the final answer
        self.play(simplified[0].animate.set_color(GREEN))
        self.wait(2)


class FractionDivision(MovingCameraScene):
    def construct(self):
        # Initial equation
        self.camera.frame.scale(0.4)
        equation = MathTex(r"\frac{\frac{5}{3}}{\frac{4}{6}} = x")
        self.play(Write(equation))

        # Extract the fractions
        upper_fraction = equation[0][0:3].copy()  # 5/3
        lower_fraction = equation[0][4:7].copy()  # 4/6
        equals_x = equation[0][7:].copy()  # = x

        # Highlight the fractions
        self.play(
            upper_fraction.animate.set_color(BLUE),
            lower_fraction.animate.set_color(RED)
        )

        # Move the lower fraction down
        self.play(
            lower_fraction.animate.shift(DOWN * 0.5),
            FadeIn(equals_x),
            FadeOut(equation)
        )
        # Invert the lower fraction (4/6 becomes 6/4)
        numerator = lower_fraction[0].copy()
        denominator = lower_fraction[-1].copy()
        line = lower_fraction[-2].copy()

        # Show the inversion
        self.play(
            FadeOut(lower_fraction, run_time=0.5),
            FadeIn(numerator, run_time=0.5),
            FadeIn(line, run_time=0.5),
            FadeIn(denominator, run_time=0.5)
        )
        inverted_fraction = VGroup(numerator, line, denominator)
        self.play(
            Swap(numerator, denominator, path_arc=PI),
            equals_x.animate.shift(RIGHT * 0.5),
            upper_fraction.animate.shift(LEFT * 0.5)
        )

        self.play(
            upper_fraction.animate.set_y(0),
            inverted_fraction.animate.set_y(0),
        )
        whole_fraction = MathTex(r"\frac{5 \times 6}{3 \times 4} = x")
        self.play(
            upper_fraction.animate.set_color(WHITE),
            inverted_fraction.animate.set_color(WHITE),
        )
        seperated_fraction = VGroup(upper_fraction, inverted_fraction)
        self.play(
            seperated_fraction.animate.shift(RIGHT * 0.3),
        )
        self.play(
            seperated_fraction.animate.scale(1.6),
        )
        self.play(
            FadeIn(whole_fraction),
            FadeOut(equals_x),
            FadeOut(seperated_fraction)
        )
        numerator_part = whole_fraction[0][:3].copy()  # "5 × 6"
        denominator_part = whole_fraction[0][4:7].copy()  # "3 × 4"

        # Move the copies to positions above and below the fraction
        self.play(
            numerator_part.animate.move_to(
                whole_fraction.get_center() + UP * 2),
            denominator_part.animate.move_to(
                whole_fraction.get_center() + DOWN * 2),
            self.camera.frame.animate.scale(2),
        )
        self.wait(0.5)

        # Show the multiplication happening
        numerator_calc = MathTex(r"5 \times 6 = 30")
        denominator_calc = MathTex(r"3 \times 4 = 12")

        # Position the calculations
        numerator_calc.move_to(numerator_part.get_center())
        denominator_calc.move_to(denominator_part.get_center())

        # Pre-color the numbers in the calculations
        numerator_calc[0][0].set_color(BLUE)   # 5
        numerator_calc[0][2].set_color(RED)    # 6
        denominator_calc[0][0].set_color(BLUE)  # 3
        denominator_calc[0][2].set_color(RED)  # 4

        # Replace the copies with the full calculations
        self.play(
            ReplacementTransform(numerator_part, numerator_calc),
            ReplacementTransform(denominator_part, denominator_calc),
        )
        self.wait(1)

        # Draw arrows pointing back to the fraction
        arrow_up = Arrow(numerator_calc.get_bottom(),
                         whole_fraction[0][0:3].get_top(), buff=0.2, color=YELLOW)
        arrow_down = Arrow(denominator_calc.get_top(
        ), whole_fraction[0][4:7].get_bottom(), buff=0.2, color=YELLOW)

        self.play(
            Create(arrow_up),
            Create(arrow_down)
        )
        self.wait(0.5)

        # Final calculated result
        calculated_equation = MathTex(r"\frac{30}{12} = x")

        # Fade out the calculation steps and arrows
        self.play(
            FadeOut(numerator_calc),
            FadeOut(denominator_calc),
            FadeOut(arrow_up),
            FadeOut(arrow_down),
            self.camera.frame.animate.scale(0.5)
        )

        # Fade out intermediate and fade in result
        self.play(
            FadeOut(whole_fraction, run_time=0.5),
            FadeIn(calculated_equation, run_time=0.5)
        )
        self.wait(1)

        # Simplify the fraction
        simplified = MathTex(r"\frac{5}{2} = x")

        # Show the simplification process
        self.play(
            calculated_equation[0][0:2].animate.set_color(YELLOW),  # 30
            calculated_equation[0][3:5].animate.set_color(YELLOW)   # 12
        )
        self.wait(0.5)

        # Add division explanation
        division_text = Text("÷ 6", font_size=24).next_to(
            calculated_equation, LEFT, buff=0.5)
        self.play(Write(division_text))
        self.wait(0.5)

        # Fade transition to simplified
        self.play(
            FadeOut(calculated_equation),
            FadeOut(division_text),
            FadeIn(simplified)
        )
        self.wait(1)

        # Highlight the final answer
        self.play(simplified[0].animate.set_color(GREEN))
        self.wait(2)


class FractionAddition(MovingCameraScene):
    def construct(self):
        self.play(self.camera.frame.animate.scale(0.4))
        equation = MathTex(r"\frac{5}{3} + \frac{4}{6} = x")
        self.play(Write(equation))
        left_denominator = equation[0][2].copy()
        right_denominator = equation[0][6].copy()

        self.play(
            left_denominator.animate.set_color(BLUE),
            right_denominator.animate.set_color(RED)
        )
        left_denominator_upp = left_denominator.copy().next_to(
            equation[0][4], RIGHT, buff=0.4)
        left_denominator_down = left_denominator.copy().next_to(
            equation[0][6], RIGHT, buff=0.4)
        right_denominator_upp = right_denominator.copy().next_to(
            equation[0][0], LEFT, buff=0.4)
        right_denominator_down = right_denominator.copy().next_to(
            equation[0][2], LEFT, buff=0.4)
        left_times_upp = MathTex(r"\times").next_to(
            right_denominator_down, RIGHT, buff=0.1)
        left_times_down = MathTex(r"\times").next_to(
            right_denominator_upp, RIGHT, buff=0.1)
        right_times_upp = MathTex(r"\times").next_to(
            left_denominator_down, LEFT, buff=0.1)
        right_times_down = MathTex(r"\times").next_to(
            left_denominator_upp, LEFT, buff=0.1)

        self.play(
            FadeIn(right_denominator_upp),
            FadeIn(right_denominator_down),
            FadeIn(left_denominator_upp),
            FadeIn(left_denominator_down),
            FadeIn(left_times_upp),
            FadeIn(left_times_down),
            FadeIn(right_times_upp),
            FadeIn(right_times_down),
        )
        top_left = MathTex(r"30")
        top_left.move_to(equation[0][0].get_center())
        bottom_left = MathTex(r"18")
        bottom_left.move_to(equation[0][2].get_center())
        top_right = MathTex(r"12")
        top_right.move_to(equation[0][4].get_center())
        bottom_right = MathTex(r"18")
        bottom_right.move_to(equation[0][6].get_center())
        self.play(
            FadeOut(left_denominator),
            FadeOut(left_times_upp),
            FadeOut(left_times_down),
            FadeOut(left_denominator_upp),
            FadeOut(left_denominator_down),
            FadeOut(equation[0][0]),
            FadeOut(equation[0][2]),
            FadeOut(right_denominator),
            FadeOut(right_times_upp),
            FadeOut(right_times_down),
            FadeOut(right_denominator_upp),
            FadeOut(right_denominator_down),
            FadeOut(equation[0][4]),
            FadeOut(equation[0][6]),
            FadeIn(top_left),
            FadeIn(bottom_left),
            FadeIn(top_right),
            FadeIn(bottom_right),
        )
        combined_equation = MathTex(r"\frac{30 + 12}{18} = x")
        self.play(
            FadeIn(combined_equation),
            FadeOut(top_left),
            FadeOut(bottom_left),
            FadeOut(top_right),
            FadeOut(bottom_right),
            FadeOut(equation[0][3]),
            FadeOut(equation[0][7]),
            FadeOut(equation[0][8]),
        )
        numerator = MathTex(r"42")
        numerator.move_to(combined_equation[0][2].get_center())
        self.play(
            FadeOut(combined_equation[0][0:5]),
            FadeIn(numerator),
        )
        calculated_equation = MathTex(r"\frac{7}{3} = x")
        division_text = Text("÷ 6", font_size=24).next_to(
            calculated_equation, LEFT, buff=0.8)
        self.play(
            numerator.animate.set_color(YELLOW),
            combined_equation[0][5:].animate.set_color(YELLOW),
            FadeIn(division_text),
        )
        self.play(
            FadeOut(combined_equation[0][5:]),
            FadeOut(numerator),
            FadeOut(division_text),
            FadeIn(calculated_equation),
            FadeOut(equation[0][1]),
            FadeOut(equation[0][5]),
        )
        self.wait(1)
