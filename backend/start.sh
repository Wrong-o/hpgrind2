#!/bin/bash
set -e

# Run the database migration to add created column to tokens table
echo "Running database migrations..."
python run_migrations.py

# Start the application
echo "Starting the application..."
exec uvicorn main:app --host 0.0.0.0 --port 8000 --reload 