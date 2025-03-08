# Use an official Python runtime as the base image
FROM python:3.11-slim

# Set working directory in the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Make the start script executable
RUN chmod +x start.sh

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["./start.sh"] 