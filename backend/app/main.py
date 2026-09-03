from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from app.api import auth, competency, quiz, recommendation, dashboard, igot
from app.models.database import init_db
from app.services.ml_loader import MLModels

load_dotenv()

ml_models = MLModels()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    try:
        ml_models.load_all()
    except Exception as e:
        print(f"Warning: ML models failed to load: {e}")
    yield
    ml_models.unload_all()

app = FastAPI(
    title="Skill Intelligence Platform",
    description="AI-Enabled Learning Platform for India's Official Statistical System - SIH PS 26101",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
FRONTEND_HOST = os.getenv("FRONTEND_HOST", "http://localhost:5173")
ALLOWED_ORIGINS = [origin.strip() for origin in FRONTEND_HOST.split(",") if origin.strip()]
ALLOWED_ORIGINS.append("http://localhost:5173")
ALLOWED_ORIGINS.append("http://localhost:8000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(competency.router, prefix="/api/competency", tags=["Competency Assessment"])
app.include_router(quiz.router, prefix="/api/quiz", tags=["Quiz Generation"])
app.include_router(recommendation.router, prefix="/api/recommendation", tags=["Recommendations"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(igot.router, prefix="/api/igot", tags=["iGOT Integration"])

@app.get("/")
async def root():
    return {"message": "Skill Intelligence Platform - SIH PS 26101"}

@app.get("/health")
async def health():
    return {"status": "healthy", "ml_models_loaded": ml_models.is_loaded()}
