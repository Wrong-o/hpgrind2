#!/usr/bin/env python3
"""
Reset User History Script

This script allows you to reset (delete) user history data from the database.
It provides options to reset data for all users or a specific user by email.

Usage:
  python reset_user_history.py --all          # Reset history for all users
  python reset_user_history.py --email user@example.com  # Reset for specific user
  python reset_user_history.py --user-id 123  # Reset for user with specific ID
  
Safety features:
- Requires explicit confirmation before deletion
- Dry run mode to preview what would be deleted
- Provides count of records to be deleted
"""

import argparse
import sys
import os

# Add the parent directory to the path so we can import our app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from sqlalchemy import func
from db_setup import get_db, engine
from api.v1.core.models import UserHistory, User

# Configure argument parser
parser = argparse.ArgumentParser(description='Reset user history data from the database.')
group = parser.add_mutually_exclusive_group(required=True)
group.add_argument('--all', action='store_true', help='Reset history for all users')
group.add_argument('--email', type=str, help='Reset history for a specific user by email')
group.add_argument('--user-id', type=int, help='Reset history for a specific user by ID')
parser.add_argument('--dry-run', action='store_true', help='Show what would be deleted without actually deleting')
parser.add_argument('--force', action='store_true', help='Skip confirmation prompt')
args = parser.parse_args()

def get_db_session():
    """Create and return a database session."""
    return next(get_db())

def reset_all_history(session: Session, dry_run: bool = False):
    """Reset history for all users."""
    count = session.query(func.count(UserHistory.id)).scalar()
    
    if count == 0:
        print("No user history records found in the database.")
        return 0
    
    print(f"Found {count} history records to delete.")
    
    if not dry_run:
        session.query(UserHistory).delete()
        session.commit()
        print(f"Successfully deleted {count} history records.")
    else:
        print(f"Dry run: Would delete {count} history records.")
    
    return count

def reset_user_history_by_email(session: Session, email: str, dry_run: bool = False):
    """Reset history for a specific user by email."""
    user = session.query(User).filter(User.email == email).first()
    
    if not user:
        print(f"No user found with email: {email}")
        return 0
    
    return reset_user_history_by_id(session, user.id, dry_run)

def reset_user_history_by_id(session: Session, user_id: int, dry_run: bool = False):
    """Reset history for a specific user by ID."""
    # Verify user exists
    user = session.query(User).filter(User.id == user_id).first()
    if not user:
        print(f"No user found with ID: {user_id}")
        return 0
    
    # Count records
    count = session.query(func.count(UserHistory.id)).filter(
        UserHistory.user_id == user_id
    ).scalar()
    
    if count == 0:
        print(f"No history records found for user {user.email} (ID: {user_id}).")
        return 0
    
    print(f"Found {count} history records for user {user.email} (ID: {user_id}).")
    
    if not dry_run:
        deleted = session.query(UserHistory).filter(
            UserHistory.user_id == user_id
        ).delete()
        session.commit()
        print(f"Successfully deleted {deleted} history records for user {user.email}.")
    else:
        print(f"Dry run: Would delete {count} history records for user {user.email}.")
    
    return count

def main():
    session = get_db_session()
    
    try:
        # Determine which reset function to call
        if args.all:
            count = reset_all_history(session, dry_run=True)  # Always do dry run first
            operation = "all user history"
        elif args.email:
            count = reset_user_history_by_email(session, args.email, dry_run=True)
            operation = f"history for user {args.email}"
        elif args.user_id:
            count = reset_user_history_by_id(session, args.user_id, dry_run=True)
            operation = f"history for user ID {args.user_id}"
        
        # Skip confirmation if --force is used or if there's nothing to delete
        if count == 0:
            return
        
        if not args.force and not args.dry_run:
            # Ask for confirmation
            confirm = input(f"\nYou are about to delete {operation} ({count} records).\nType 'yes' to continue: ")
            if confirm.lower() != 'yes':
                print("Operation cancelled.")
                return
        
        # Perform the actual deletion if not a dry run
        if not args.dry_run:
            if args.all:
                reset_all_history(session)
            elif args.email:
                reset_user_history_by_email(session, args.email)
            elif args.user_id:
                reset_user_history_by_id(session, args.user_id)
            
            print("Reset operation completed successfully.")
    
    except Exception as e:
        print(f"Error: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    main() 