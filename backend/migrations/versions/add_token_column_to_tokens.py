"""Add token column to tokens table

Revision ID: 002
Revises: 001
Create Date: 2024-03-25

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '002'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add token column with unique index
    op.add_column('tokens', 
                 sa.Column('token', sa.String(), nullable=False))
    
    # Add unique index on token column
    op.create_index('ix_tokens_token', 'tokens', ['token'], unique=True)


def downgrade() -> None:
    # Drop the index and column
    op.drop_index('ix_tokens_token', table_name='tokens')
    op.drop_column('tokens', 'token') 