#!/usr/bin/env python3

"""
Script to reset the achievements tables and populate them with default data.
This will:
1. Drop and recreate the achievements and user_achievements tables
2. Populate the achievements table with default achievements
"""

from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from api.v1.core.models import Base, Achievement, UserAchievements
from settings import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def reset_achievements_tables():
    """Drop and recreate the achievements tables"""
    engine = create_engine(settings.DB_URL)
    
    # Drop tables if they exist
    logger.info("Dropping existing achievements tables...")
    with engine.connect() as conn:
        conn.execute(text("DROP TABLE IF EXISTS user_achievements CASCADE"))
        conn.execute(text("DROP TABLE IF EXISTS achievements CASCADE"))
        conn.commit()
    
    # Create tables from models
    logger.info("Creating fresh achievements tables...")
    # Create only the Achievement and UserAchievements tables
    Achievement.__table__.create(engine)
    UserAchievements.__table__.create(engine)
    
    logger.info("Tables recreated successfully!")
    return engine

def populate_default_achievements(engine):
    """Add default achievements to the database"""
    logger.info("Populating default achievements...")
    
    default_achievements = [
        {
            "title": "Välgrundad",
            "description": "Klara av grunderna"
        },
        {
            "title": "Kalibrerad och klar",
            "description": "Gör klar kalibreringen för formelbladet"
        },
        {
            "title": "Välformulerad",
            "description": "Nå gul nivå på formelbladet"
        },
        {
            "title": "Formel-1 bladet",
            "description": "Nå grön nivå på formelbladet"
        },
        {
            "title": "XYZÅÄÖ",
            "description": "Ha rätt på 50 XYZ frågor"
        },
        {
            "title": "NOGrann",
            "description": "Klara 50 NOG frågor"
        },
        {
            "title": "KVAlitet och kvantitativ",
            "description": "Klara 50 KVA frågor"
        },
        {
            "title": "DTKartmästare",
            "description": "Klara 50 DTK frågor"
        }
        
        
    ]
    
    with Session(engine) as session:
        for achievement_data in default_achievements:
            achievement = Achievement(**achievement_data)
            session.add(achievement)
        
        session.commit()
    
    logger.info(f"Added {len(default_achievements)} default achievements")

if __name__ == "__main__":
    engine = reset_achievements_tables()
    populate_default_achievements(engine)
    logger.info("Achievement tables reset and populated successfully!") 