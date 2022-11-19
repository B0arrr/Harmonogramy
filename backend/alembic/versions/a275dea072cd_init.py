"""Init

Revision ID: a275dea072cd
Revises: 
Create Date: 2022-11-19 16:58:04.428357

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a275dea072cd'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('company',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('company', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_company_id'), 'company', ['id'], unique=False)
    op.create_table('employment',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('employment', sa.String(), nullable=True),
    sa.Column('max_hours_per_week', sa.Integer(), nullable=True),
    sa.Column('max_hours_per_day', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_employment_employment'), 'employment', ['employment'], unique=False)
    op.create_index(op.f('ix_employment_id'), 'employment', ['id'], unique=False)
    op.create_table('position',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('position', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_position_id'), 'position', ['id'], unique=False)
    op.create_table('schedule',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('start_day', sa.Date(), nullable=True),
    sa.Column('day_off', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_schedule_id'), 'schedule', ['id'], unique=False)
    op.create_index(op.f('ix_schedule_start_day'), 'schedule', ['start_day'], unique=False)
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(), nullable=True),
    sa.Column('last_name', sa.String(), nullable=True),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('password', sa.String(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('is_superuser', sa.Boolean(), nullable=True),
    sa.Column('is_employed', sa.Boolean(), nullable=True),
    sa.Column('date_of_employment', sa.Date(), nullable=True),
    sa.Column('date_of_fired', sa.Date(), nullable=True),
    sa.Column('company_id', sa.Integer(), nullable=True),
    sa.Column('employment_id', sa.Integer(), nullable=True),
    sa.Column('position_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['company_id'], ['company.id'], ),
    sa.ForeignKeyConstraint(['employment_id'], ['employment.id'], ),
    sa.ForeignKeyConstraint(['position_id'], ['position.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_email'), 'user', ['email'], unique=True)
    op.create_index(op.f('ix_user_first_name'), 'user', ['first_name'], unique=False)
    op.create_index(op.f('ix_user_id'), 'user', ['id'], unique=False)
    op.create_index(op.f('ix_user_last_name'), 'user', ['last_name'], unique=False)
    op.create_table('scheduleemployee',
    sa.Column('schedule_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('shift_start', sa.DateTime(), nullable=True),
    sa.Column('shift_end', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['schedule_id'], ['schedule.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('schedule_id', 'user_id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('scheduleemployee')
    op.drop_index(op.f('ix_user_last_name'), table_name='user')
    op.drop_index(op.f('ix_user_id'), table_name='user')
    op.drop_index(op.f('ix_user_first_name'), table_name='user')
    op.drop_index(op.f('ix_user_email'), table_name='user')
    op.drop_table('user')
    op.drop_index(op.f('ix_schedule_start_day'), table_name='schedule')
    op.drop_index(op.f('ix_schedule_id'), table_name='schedule')
    op.drop_table('schedule')
    op.drop_index(op.f('ix_position_id'), table_name='position')
    op.drop_table('position')
    op.drop_index(op.f('ix_employment_id'), table_name='employment')
    op.drop_index(op.f('ix_employment_employment'), table_name='employment')
    op.drop_table('employment')
    op.drop_index(op.f('ix_company_id'), table_name='company')
    op.drop_table('company')
    # ### end Alembic commands ###
