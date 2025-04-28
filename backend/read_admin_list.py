from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
from api.v1.core.models import User, Role, UserRole
from settings import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def list_admins():
    """List all users with admin role"""
    engine = create_engine(settings.DB_URL)
    with Session(engine) as session:
        # Find the admin role
        admin_role = session.query(Role).filter(Role.name == "admin").first()
        
        if not admin_role:
            logger.info("No admin role found in the database")
            return
        
        # Query all users with admin role
        admin_users = (
            session.query(User)
            .join(UserRole)
            .filter(UserRole.role_id == admin_role.id)
            .all()
        )
        
        if not admin_users:
            logger.info("No users with admin role found")
            return
        
        logger.info("=== Admin Users ===")
        for user in admin_users:
            print(f"Email: {user.email}")

if __name__ == "__main__":
    list_admins()
