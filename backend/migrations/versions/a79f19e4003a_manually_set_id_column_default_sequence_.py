"""manually set id column default sequence for user_history

Revision ID: a79f19e4003a
Revises: 7f9e3ac05b72
Create Date: 2025-04-09 17:18:53.390448

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a79f19e4003a'
down_revision: Union[str, None] = '7f9e3ac05b72'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Define sequence name for clarity
SEQUENCE_NAME = 'user_history_id_seq'

def upgrade() -> None:
    """Upgrade schema."""
    # Create the sequence if it doesn't exist (idempotent)
    op.execute(f"CREATE SEQUENCE IF NOT EXISTS {SEQUENCE_NAME}")
    # Set the column default to use the sequence
    op.execute(f"ALTER TABLE user_history ALTER COLUMN id SET DEFAULT nextval('{SEQUENCE_NAME}')")
    # Optional: Associate the sequence with the column for ownership (helps with dropping table)
    op.execute(f"ALTER SEQUENCE {SEQUENCE_NAME} OWNED BY user_history.id")


def downgrade() -> None:
    """Downgrade schema."""
    # Remove the default value from the column
    op.execute("ALTER TABLE user_history ALTER COLUMN id DROP DEFAULT")
    # Drop the sequence if it exists
    op.execute(f"DROP SEQUENCE IF EXISTS {SEQUENCE_NAME}")
