#!/bin/bash
set -e

# Start the application directly without running migrations
echo "Starting the application..."
exec uvicorn main:app --host 0.0.0.0 --port 8000 --reload 