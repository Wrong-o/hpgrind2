from sqlalchemy.orm import Session
from models.database_models import Category, Question
from database import SessionLocal

def seed_database():
    db = SessionLocal()
    try:
        # Check if we already have categories
        if db.query(Category).first():
            print("Database already seeded")
            return

        # Create categories
        categories = [
            Category(
                name="XYZ",
                description="Algebra och ekvationer"
            ),
            Category(
                name="DTK",
                description="Diagram, tabeller och kartor"
            ),
            Category(
                name="NOG",
                description="Numerisk och grafisk problemlösning"
            ),
            Category(
                name="PRO",
                description="Problemlösning"
            ),
        ]
        
        db.add_all(categories)
        db.commit()

        # Create some sample questions for each category
        for category in categories:
            questions = [
                Question(
                    category_id=category.id,
                    question_type="math",
                    difficulty=5.0,
                    expected_time=120
                )
                for _ in range(5)  # 5 questions per category
            ]
            db.add_all(questions)
        
        db.commit()
        print("Database seeded successfully!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database() 