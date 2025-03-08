# HPGrind Backend

This is the backend service for the HPGrind application.

## Running with Docker

The easiest way to run the backend is using Docker and Docker Compose.

### Prerequisites

- Docker
- Docker Compose

### Starting the Services

From the root directory of the project, run:

```bash
docker-compose up -d
```

This will:
1. Build the backend Docker image
2. Start a PostgreSQL database
3. Run database migrations
4. Start the backend service

The API will be available at http://localhost:8000

### Stopping the Services

```bash
docker-compose down
```

To remove all data (including the database volume):

```bash
docker-compose down -v
```

### Viewing Logs

```bash
docker-compose logs -f backend
```

## Development

For local development without Docker:

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up the database:
   ```bash
   alembic upgrade head
   ```

4. Run the application:
   ```bash
   uvicorn main:app --reload
   ```

The API will be available at http://localhost:8000 