#!/usr/bin/env python3
import sys
import argparse
from sqlalchemy import select
from sqlalchemy.orm import Session

from api.v1.core.models import User, Token, PasswordResetToken, EmailVerificationToken
from db_setup import get_db

def remove_user_by_email(email: str, db: Session, confirm: bool = False) -> bool:
    """
    Remove a user and all associated data by email address
    
    Args:
        email: The email address of the user to remove
        db: Database session
        confirm: Whether to actually perform the deletion (False for dry run)
        
    Returns:
        bool: True if user was found and removed, False otherwise
    """
    # Find the user
    user = db.execute(select(User).where(User.email == email)).scalars().first()
    
    if not user:
        print(f"User with email '{email}' not found.")
        return False
    
    user_id = user.id
    
    # Print user information
    print(f"Found user: ID={user.id}, Email={user.email}, Created={user.created_at}")
    
    # Count related records
    tokens_count = db.execute(select(Token).where(Token.user_id == user_id)).all()
    reset_tokens_count = db.execute(select(PasswordResetToken).where(PasswordResetToken.user_id == user_id)).all()
    verification_tokens_count = db.execute(select(EmailVerificationToken).where(EmailVerificationToken.user_id == user_id)).all()
    
    print(f"Related records:")
    print(f"- Authentication Tokens: {len(tokens_count)}")
    print(f"- Password Reset Tokens: {len(reset_tokens_count)}")
    print(f"- Email Verification Tokens: {len(verification_tokens_count)}")
    
    if not confirm:
        print("\nDRY RUN: No changes made. Run with --confirm to actually delete the user.")
        return True
    
    # Delete related records first (to avoid foreign key constraint violations)
    if tokens_count:
        db.execute(Token.__table__.delete().where(Token.user_id == user_id))
        print(f"Deleted {len(tokens_count)} authentication tokens")
        
    if reset_tokens_count:
        db.execute(PasswordResetToken.__table__.delete().where(PasswordResetToken.user_id == user_id))
        print(f"Deleted {len(reset_tokens_count)} password reset tokens")
        
    if verification_tokens_count:
        db.execute(EmailVerificationToken.__table__.delete().where(EmailVerificationToken.user_id == user_id))
        print(f"Deleted {len(verification_tokens_count)} email verification tokens")
    
    # Delete the user
    db.delete(user)
    print(f"Deleted user: {email}")
    
    # Commit the transaction
    db.commit()
    print("Transaction committed successfully")
    
    return True

def main():
    parser = argparse.ArgumentParser(description='Remove a user by email address')
    parser.add_argument('email', help='Email address of the user to remove')
    parser.add_argument('--confirm', action='store_true', help='Confirm the deletion (without this flag, no changes will be made)')
    
    args = parser.parse_args()
    
    with next(get_db()) as db:
        success = remove_user_by_email(args.email, db, args.confirm)
        if success and args.confirm:
            print(f"User '{args.email}' and all related data have been removed.")
        elif success:
            print(f"User '{args.email}' found. Run with --confirm to actually delete.")
        else:
            print(f"Failed to remove user '{args.email}'.")
            sys.exit(1)

if __name__ == "__main__":
    main() 