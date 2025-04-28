from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from api.v1.core.models import Base, UserRole, User, Role
from api.v1.core.schemas import Permission
from settings import settings
import json
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def give_admin(user_email: str):
    """Give admin role to a user"""
    engine = create_engine(settings.DB_URL)
    with Session(engine) as session:
        # First, ensure admin role exists
        admin_role = session.query(Role).filter(Role.name == "admin").first()
        if not admin_role:
            admin_role = Role(
                name="admin",
                description="Administrator with full access",
                permissions=json.dumps([perm.value for perm in Permission])
            )
            session.add(admin_role)
            session.flush()  # This will assign an ID to admin_role
            logger.info("Created admin role")

        # Find the user
        user = session.query(User).filter(User.email == user_email).first()
        if user:
            # Check if user already has admin role
            if any(role.role.name == "admin" for role in user.roles):
                logger.info(f"User {user_email} already has admin role")
                return

            # Assign admin role to user
            user.roles.append(UserRole(role=admin_role))
            session.commit()
            logger.info(f"Admin role given to {user_email}")
        else:
            logger.error(f"User with email {user_email} not found")

if __name__ == "__main__":
    give_admin("test@testing.se")