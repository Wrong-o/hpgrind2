import json
import secrets
from datetime import datetime, timedelta, timezone
import requests
from api.v1.core.models import PasswordResetToken, User
from settings import settings
from sqlalchemy import select
from sqlalchemy.orm import Session

def get_user_by_email(session: Session, email: str) -> User:
    """
    Get a user by their email address

    """
    return session.scalars(select(User).where(User.email == email)).first()
    
def generate_password_reset_token(user_id: int, db: Session) -> str:
    """
    Generates a secure random token for password reset and store it in the databse
    """
    token = secrets.token_urlsafe(32)

    reset_token = PasswordResetToken(token=token, user_id=user_id)

    db.add(reset_token)
    db.commit()

    return token
#
def send_password_reset_email(email: str, token: str):
    """
    Send a password reset email using Postmark API
    """
    print(token)
    reset_url = f"{settings.FRONTEND_BASE_URL}/password-reset?token={token}"

    message = {
        "From": "support@example.com",
        "To": email,
        "Subject": "Återställ ditt lösenord",
        "HtmlBody": f"""
            <html>
                <body>
                    <h1>Återställ ditt lösenord</h1>
                    <p>Klicka på länken nedan för att återställa ditt lösenord:</p>
                    <p>Länken kommer att upphöra om {settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES} minuter</p>
                    <a href="{reset_url}">Återställ lösenord</a>
                </body>
            </html>
        """
    }
    
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": settings.POSTMARK_TOKEN,
    }
    
    try:
        response = requests.post(
            "https://api.postmarkapp.com/email",
            headers=headers,
            data=json.dumps(message),
        )
        response.raise_for_status()
        print(f"Email skickat till {email}: {response.status_code}")
        return True
    except Exception as e:
        print(f"Misslyckades med att skicka email till {email}: {e}")
        return False 