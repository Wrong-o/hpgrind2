from sqlalchemy.orm import Session
from models.database_models import Category, Question, DBUser, Delmoment, Achievement
from database import SessionLocal, engine
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
        
        # Check if achievements already exist
        existing_achievements = db.query(Achievement).count()
        if existing_achievements > 0:
            print("Database already seeded with achievements")
            return

        # Create milestone achievements
        milestones = [
            {
                "name": "Välgrundad",
                "description": "Klara av grunderna i matematiken",
            },
            {
                "name": "Kalibrerad och klar",
                "description": "Genomför kalibreringsfasen",
            },
            {
                "name": "Välformulerad",
                "description": "Få minst gul nivå på alla moment i formelbladet",
            },
            {
                "name": "Formel-1 bladet",
                "description": "Få grön nivå på alla moment i formelbladet",
            },
            # Test-specific achievements
            {
                "name": "XYZåäö",
                "description": "Klara 50 XYZ frågor",
            },
            {
                "name": "NOGrann",
                "description": "Klara 50 NOG frågor",
            },
            {
                "name": "KVAlite och kvantitet",
                "description": "Klara 50 KVA frågor",
            },
            {
                "name": "DTKartmästare",
                "description": "Klara 50 DTK frågor",
            }
        ]

        # Add achievements to database
        for milestone in milestones:
            achievement = Achievement(
                name=milestone["name"],
                description=milestone["description"]
            )
            db.add(achievement)

        db.commit()
        print("Successfully seeded achievements")

    except Exception as e:
        print(f"Error seeding database: {str(e)}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database() 