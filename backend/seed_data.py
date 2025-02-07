from sqlalchemy.orm import Session
from models.database_models import Category, Question, DBUser, Delmoment
from database import SessionLocal
from auth import get_password_hash
import random

def seed_database():
    """
    Seeds the database with initial data.
    Only seeds if tables are empty.
    """
    db = SessionLocal()
    try:
        # Check if we already have users
        existing_users = db.query(DBUser).first()
        if not existing_users:
            print("Seeding users...")
            # Create test user
            test_user = DBUser(
                email="test@test.se",
                hashed_password=get_password_hash("test123")
            )
            db.add(test_user)
            db.commit()
            print("Created test user: test@test.se / test123")
        
        # Check if we already have categories
        if db.query(Category).first():
            print("Database already seeded")
            return

        # Create main categories (provdel)
        provdel_categories = {
            "XYZ": "Algebra och ekvationer",
            "NOG": "Numerisk och grafisk problemlösning",
            "PRO": "Problemlösning",
            "DTK": "Diagram, tabeller och kartor"
        }
        
        categories = {}
        for name, desc in provdel_categories.items():
            cat = Category(name=name, description=desc)
            db.add(cat)
            categories[name] = cat
        
        # Create delmoment
        xyz_delmoment = [
            ("Andragradsekvationer", "Andragradsekvationer och kvadratkomplettering"),
            ("Exponentialekvationer", "Ekvationer med exponenter"),
            ("Logaritmekvationer", "Ekvationer med logaritmer"),
            ("Rotekvationer", "Ekvationer med rottecken"),
            ("Olikheter", "Algebraiska olikheter"),
        ]
        
        delmoments = {}
        for name, desc in xyz_delmoment:
            delm = Delmoment(name=name, description=desc)
            db.add(delm)
            delmoments[name] = delm
            
        db.commit()
        print("Created categories and delmoment")
        
        # Create some sample questions
        for provdel, category in categories.items():
            for i in range(3):  # 3 questions per category
                question = Question(
                    category_id=category.id,
                    question_type="math",
                    amne="Kvantitativ" if provdel in ["XYZ", "NOG"] else "Kvalitativ",
                    provdel=provdel,
                    difficulty=3.0 + i,
                    expected_time=120
                )
                if provdel == "XYZ":
                    # Add some delmoment to XYZ questions
                    question.delmoment.extend(
                        random.sample(list(delmoments.values()), 2)
                    )
                db.add(question)
        
        db.commit()
        print("Database seeded successfully!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database() 