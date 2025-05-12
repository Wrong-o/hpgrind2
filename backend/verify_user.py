#!/usr/bin/env python3
import sys
import argparse
from sqlalchemy import select
from sqlalchemy.orm import Session

from api.v1.core.models import User
from db_setup import get_db

def verify_user_by_email(email: str, db: Session, confirm: bool = False) -> bool:
    """
    Manually verify a user by email address
    
    Args:
        email: The email address of the user to verify
        db: Database session
        confirm: Whether to actually perform the update (False for dry run)
        
    Returns:
        bool: True if user was found and verified, False otherwise
    """
    # Find the user
    user = db.execute(select(User).where(User.email == email)).scalars().first()
    
    if not user:
        print(f"User with email '{email}' not found.")
        return False
    
    # Print user information
    print(f"Found user: ID={user.id}, Email={user.email}, Created={user.created_at}")
    print(f"Current verification status: {'Verified' if user.is_verified else 'Not verified'}")
    
    if user.is_verified:
        print("User is already verified. No action needed.")
        return True
    
    if not confirm:
        print("\nDRY RUN: No changes made. Run with --confirm to actually verify the user.")
        return True
    
    # Update user verification status
    user.is_verified = True
    
    # Commit the transaction
    db.commit()
    print(f"User '{email}' has been verified.")
    print("Transaction committed successfully")
    
    return True

def main():
    parser = argparse.ArgumentParser(description='Manually verify a user by email address')
    parser.add_argument('email', help='Email address of the user to verify')
    parser.add_argument('--confirm', action='store_true', help='Confirm the verification (without this flag, no changes will be made)')
    
    args = parser.parse_args()
    
    with next(get_db()) as db:
        success = verify_user_by_email(args.email, db, args.confirm)
        if success and args.confirm:
            print(f"User '{args.email}' has been successfully verified.")
        elif success and not args.confirm and not db.execute(select(User).where(User.email == args.email)).scalars().first().is_verified:
            print(f"User '{args.email}' found. Run with --confirm to verify this user.")
        elif not success:
            print(f"Failed to verify user '{args.email}'.")
            sys.exit(1)

if __name__ == "__main__":
    main() 