#!/bin/bash
# Load environment variables from .env file
set -a
source .env
set +a

# Start uvicorn with the loaded environment
exec uvicorn main:app --host "0.0.0.0" --port 8000