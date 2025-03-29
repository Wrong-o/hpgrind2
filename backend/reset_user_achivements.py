#!/usr/bin/env python3
"""
Script to reset the user_achievements tables and populate them with default data.
This will:
1. Drop and recreate the user_achievements tables
2. Populate the user_achievements table with default data
"""

from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from api.v1.core.models import Base, UserAchievements
from settings import settings
import logging
from datetime import datetime
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def reset_user_achievements_tables():
    """Drop and recreate the achievements tables"""
    engine = create_engine(settings.DB_URL)
    
    logger.info("Dropping existing user_achievements tables...")
    with engine.connect() as conn:
        conn.execute(text("DROP TABLE IF EXISTS user_achievements CASCADE"))
        conn.commit()
    UserAchievements.__table__.create(engine)
    
    logger.info("User_achievements table recreated successfully!")
    return engine

def populate_default_achievements(engine):
    """Add default achievements to the database"""
    logger.info("Populating the user_achievements table...")
    
    default_achievements = [
        {
            "user_id": 1,
            "achievement_id": 1,
            "timestamp": datetime.now()
        },
        {
            "user_id": 1,
            "achievement_id": 2,
            "timestamp": datetime.now()
        }
        
        
    ]
    
    with Session(engine) as session:
        for achievement_data in default_achievements:
            achievement = UserAchievements(**achievement_data)
            session.add(achievement)
        
        session.commit()
    
    logger.info(f"Added {len(default_achievements)} default achievements")

if __name__ == "__main__":
    engine = reset_user_achievements_tables()
    populate_default_achievements(engine)
    logger.info("Achievement tables reset and populated successfully!") 