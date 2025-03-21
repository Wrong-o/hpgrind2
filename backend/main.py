from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, status, requests
from api.v1.core.models import Base
from api.v1.core.schemas import User
from db_setup import init_db, get_db
from api.v1.routers import router
from sqlalchemy import delete, insert, select, update
from sqlalchemy.orm import Session, joinedload, selectinload
from fastapi.middleware.cors import CORSMiddleware

async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(router, prefix="/api/v1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)