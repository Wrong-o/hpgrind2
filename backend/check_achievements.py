#!/usr/bin/env python3

"""
Script to check achievements in the database
"""

from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
from api.v1.core.models import Achievement
from settings import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_achievements():
    """Query and display achievements from the database"""
    engine = create_engine(settings.DB_URL)
    
    with Session(engine) as session:
        # Query all achievements
        query = select(Achievement)
        achievements = session.execute(query).scalars().all()
        
        logger.info(f"Total achievements: {len(achievements)}")
        
        # Display each achievement
        for a in achievements:
            logger.info(f"ID: {a.id}, Title: {a.title}, Description: {a.description}, Created: {a.created_at}")

if __name__ == "__main__":
    check_achievements() 