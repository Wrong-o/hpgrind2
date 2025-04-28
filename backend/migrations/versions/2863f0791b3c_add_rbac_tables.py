"""add_rbac_tables

Revision ID: 2863f0791b3c
Revises: a79f19e4003a
Create Date: 2025-04-16 16:59:33.449277

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2863f0791b3c'
down_revision: Union[str, None] = 'a79f19e4003a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
