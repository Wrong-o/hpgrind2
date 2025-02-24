"""create initial tables

Revision ID: 240ad6fcb020
Revises: 
Create Date: 2024-02-21 19:49:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '240ad6fcb020'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create user_table
    op.create_table('user_table',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=100), nullable=False),
        sa.Column('password', sa.String(length=100), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )

    # Create categories table
    op.create_table('categories',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('description', sa.String(), nullable=True),
        sa.Column('parent_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['parent_id'], ['categories.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_categories_id'), 'categories', ['id'], unique=False)
    op.create_index(op.f('ix_categories_name'), 'categories', ['name'], unique=True)

    # Create questions table
    op.create_table('questions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('question_type', sa.String(), nullable=True),
        sa.Column('amne', sa.String(), nullable=True),
        sa.Column('provdel', sa.String(), nullable=True),
        sa.Column('difficulty', sa.Float(), nullable=True),
        sa.Column('expected_time', sa.Integer(), nullable=True),
        sa.Column('category_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_questions_id'), 'questions', ['id'], unique=False)

    # Create delmoment table
    op.create_table('delmoment',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('description', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_delmoment_id'), 'delmoment', ['id'], unique=False)

    # Create question_delmoment table
    op.create_table('question_delmoment',
        sa.Column('question_id', sa.Integer(), nullable=True),
        sa.Column('delmoment_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['delmoment_id'], ['delmoment.id'], ),
        sa.ForeignKeyConstraint(['question_id'], ['questions.id'], )
    )

    # Create premium table
    op.create_table('premium',
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('tier', sa.SmallInteger(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['user_table.id'], ),
        sa.PrimaryKeyConstraint('user_id')
    )

    # Create achievements table
    op.create_table('achievements',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.String(length=100), nullable=False),
        sa.Column('category_id', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create gear table
    op.create_table('gear',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('type', sa.String(length=100), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    # Create user_history table
    op.create_table('user_history',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('subject', sa.String(length=100), nullable=False),
        sa.Column('category', sa.String(length=100), nullable=False),
        sa.Column('moment', sa.String(length=100), nullable=False),
        sa.Column('difficulty', sa.SmallInteger(), nullable=False),
        sa.Column('skipped', sa.Boolean(), nullable=True),
        sa.Column('time', sa.SmallInteger(), nullable=False),
        sa.Column('is_correct', sa.Boolean(), nullable=True),
        sa.Column('question_data', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['user_table.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create question_attempts table
    op.create_table('question_attempts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('question_id', sa.Integer(), nullable=False),
        sa.Column('timestamp', sa.DateTime(), nullable=True),
        sa.Column('correct', sa.Boolean(), nullable=False),
        sa.Column('time_taken', sa.Float(), nullable=True),
        sa.ForeignKeyConstraint(['question_id'], ['questions.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['user_table.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create user_category_progress table
    op.create_table('user_category_progress',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('category_id', sa.Integer(), nullable=False),
        sa.Column('progress', sa.Float(), nullable=True),
        sa.Column('last_updated', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['user_table.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Create user_achievements table
    op.create_table('user_achievements',
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('achievement_id', sa.Integer(), nullable=False),
        sa.Column('achieved', sa.Boolean(), nullable=True),
        sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['achievement_id'], ['achievements.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['user_table.id'], ),
        sa.PrimaryKeyConstraint('user_id', 'achievement_id')
    )

    # Create user_gear table
    op.create_table('user_gear',
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('gear_id', sa.Integer(), nullable=False),
        sa.Column('unlocked', sa.Boolean(), nullable=True),
        sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['gear_id'], ['gear.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['user_table.id'], ),
        sa.PrimaryKeyConstraint('user_id', 'gear_id')
    )


def downgrade() -> None:
    # Drop tables in reverse order
    op.drop_table('user_gear')
    op.drop_table('user_achievements')
    op.drop_table('user_category_progress')
    op.drop_table('question_attempts')
    op.drop_table('user_history')
    op.drop_table('gear')
    op.drop_table('achievements')
    op.drop_table('premium')
    op.drop_table('question_delmoment')
    op.drop_table('delmoment')
    op.drop_index(op.f('ix_questions_id'), table_name='questions')
    op.drop_table('questions')
    op.drop_index(op.f('ix_categories_name'), table_name='categories')
    op.drop_index(op.f('ix_categories_id'), table_name='categories')
    op.drop_table('categories')
    op.drop_table('user_table')
