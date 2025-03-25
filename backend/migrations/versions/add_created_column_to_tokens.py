"""Add created column to tokens table

Revision ID: 001
Revises: 
Create Date: 2024-03-25

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from datetime import datetime, timezone


# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add created column with default value
    op.add_column('tokens', 
                  sa.Column('created', sa.DateTime(), 
                            server_default=sa.text("CURRENT_TIMESTAMP"),
                            nullable=False))


def downgrade() -> None:
    # Drop the created column
    op.drop_column('tokens', 'created') 