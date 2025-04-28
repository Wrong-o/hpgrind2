from fastapi import APIRouter
from api.v1.core.endpoints.general import router as general_router
from api.v1.core.endpoints.question_director import router as question_director_router
from api.v1.core.endpoints.authentication import router as auth_router
from api.v1.core.endpoints.chat_bot import router as chat_bot_router
router = APIRouter()

router.include_router(general_router, prefix="/general", tags=["general"])
router.include_router(
    question_director_router,
    prefix="/question_generator", tags=["question_generator"])
router.include_router(auth_router, prefix="/auth", tags=["auth"]) 
router.include_router(chat_bot_router, prefix="/chat_bot", tags=["chat_bot"])