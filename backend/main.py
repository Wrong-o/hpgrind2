from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from quiz_generator import generate_math_question, QuizQuestion

app = FastAPI()

# Move CORS middleware configuration to the top
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"message": str(exc)},
    )

@app.options("/api/question")
async def options_question():
    return {"message": "OK"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/goals")
async def get_goals():
    # Placeholder for database integration
    return {"goals": []}

@app.get("/api/question")
async def get_question():
    try:
        return generate_math_question()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))