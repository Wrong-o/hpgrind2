"""Update achievements and user_achievements tables

Revision ID: fd9891e6808b
Revises: 41ba55414793
Create Date: 2025-03-29 19:00:23.682013

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fd9891e6808b'
down_revision: Union[str, None] = '41ba55414793'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
