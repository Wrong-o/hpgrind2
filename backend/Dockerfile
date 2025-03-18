version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/hpg
      - SECRET_KEY=your-secret-key-here
      - ACCESS_TOKEN_EXPIRE_MINUTES=120
      - ENV=development
    depends_on:
      - db
    volumes:
      - ./backend:/app
    restart: unless-stopped

  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_DB=hpg
    ports:
      - "5433:5432"
    restart: unless-stopped

volumes:
  postgres_data: 