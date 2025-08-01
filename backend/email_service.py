import json
import secrets
from datetime import datetime, timedelta, timezone
import requests
from api.v1.core.models import PasswordResetToken, EmailVerificationToken, User
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

def generate_verification_token(user_id: int, db: Session) -> str:
    """
    Generates a secure random token for email verification and stores it in the database
    """
    token = secrets.token_urlsafe(32)

    verification_token = EmailVerificationToken(token=token, user_id=user_id)

    db.add(verification_token)
    db.commit()

    return token

def send_password_reset_email(email: str, token: str):
    """
    Send a password reset email using Postmark API
    """
    print(token)
    reset_url = f"{settings.FRONTEND_BASE_URL}/password-reset-confirm?token={token}"

    message = {
        "From": "support@hpgrind.se",
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

def send_verification_email(email: str, token: str):
    """
    Send an email verification email using Postmark API
    """
    print(token)
    verification_url = f"{settings.FRONTEND_BASE_URL}/verify-email?token={token}"

    message = {
        "From": "support@hpgrind.se",
        "To": email,
        "Subject": "Verifiera din e-postadress",
        "HtmlBody": f"""
            <html>
                <body>
                    <h1>Verifiera din e-postadress</h1>
                    <p>Välkommen! Klicka på länken nedan för att verifiera din e-postadress:</p>
                    <p>Länken kommer att upphöra om {settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES} minuter</p>
                    <a href="{verification_url}">Verifiera min e-postadress</a>
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
        print(f"Verifieringsemail skickat till {email}: {response.status_code}")
        return True
    except Exception as e:
        print(f"Misslyckades med att skicka verifieringsemail till {email}: {e}")
        return False 