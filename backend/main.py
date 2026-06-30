"""FastAPI entry point for Python and AI services."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes.health import router as health_router

app = FastAPI(title="Bricks Maker Advertisement API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(health_router, prefix="/api")


@app.get("/")
def root() -> dict[str, str]:
    return {"service": "Bricks Maker Advertisement API", "status": "online"}
