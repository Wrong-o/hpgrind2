import os
import sys
from dotenv import load_dotenv
import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

# Add the project root to the Python path to find models
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.insert(0, project_root)

# Import your models' Base here
from api.v1.core.models import Base  # Adjust the import path if needed

# Load .env file from the backend directory
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

# --- Alembic Configuration ---

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set the target metadata for 'autogenerate' support
target_metadata = Base.metadata

# Get the database URL from environment variable or .env file
DB_URL = os.getenv('DB_URL')
if not DB_URL:
    print("Warning: DB_URL environment variable not found. Check .env or environment.")
    # Fallback or raise an error if needed
    # Example fallback to the old ini value (remove if not desired):
    # DB_URL = config.get_main_option("sqlalchemy.url", "postgresql+psycopg2://user:pass@host/db") 

# Override the sqlalchemy.url from alembic.ini if DB_URL is set
if DB_URL:
    config.set_main_option('sqlalchemy.url', DB_URL)

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    # Use the dynamically determined URL
    url = config.get_main_option("sqlalchemy.url") 
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    # Use the dynamically determined URL
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        # url=config.get_main_option("sqlalchemy.url") # Ensure URL is passed if needed by async
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    # Force synchronous execution for simplicity, avoiding async driver requirement.
    connectable = config.attributes.get('connection', None)
    if connectable is None:
        from sqlalchemy import engine_from_config
        connectable = engine_from_config(
            config.get_section(config.config_ini_section),
            prefix='sqlalchemy.',
            poolclass=pool.NullPool
        )
    
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )
        with context.begin_transaction():
            context.run_migrations()

    # The original async code is commented out below 
    # # If using async engine:
    # try:
    #     # Use the dynamically determined URL implicitly via config
    #     asyncio.run(run_async_migrations())
    # except TypeError:
    #     # Fallback for older Python versions or sync configurations
    #     print("Running synchronous migrations as fallback or async setup issue.")
    #     connectable = config.attributes.get('connection', None)
    #     if connectable is None:
    #         from sqlalchemy import engine_from_config
    #         connectable = engine_from_config(
    #             config.get_section(config.config_ini_section),
    #             prefix='sqlalchemy.',
    #             poolclass=pool.NullPool
    #         )
        
    #     with connectable.connect() as connection:
    #         context.configure(
    #             connection=connection,
    #             target_metadata=target_metadata
    #         )
    #         with context.begin_transaction():
    #             context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
