"""StadiumMind AI - FastAPI Application Entry Point."""

from contextlib import asynccontextmanager
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import WebSocket, WebSocketDisconnect

from app.config import get_settings
from app.database import init_db, close_db
from app.websocket.manager import manager, broadcast_periodic_updates
from app.middleware.security import SecurityMiddleware
from app.api.routes import (
    stadium, medical, security, vendor, transport,
    ai, auth, simulation, operations,
)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle: startup and shutdown."""
    print(f"StadiumMind AI v{settings.APP_VERSION} starting...")
    if not settings.USE_MOCK_DATA:
        await init_db()
    # Start periodic WebSocket broadcast task
    import asyncio
    broadcast_task = asyncio.create_task(broadcast_periodic_updates())
    yield
    broadcast_task.cancel()
    if not settings.USE_MOCK_DATA:
        await close_db()
    print("Server shutting down")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="The Generative AI Operating System for FIFA World Cup 2026 Stadiums",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://stadium-mind.ai",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With"],
)

# Security middleware (rate limiting, headers)
app.add_middleware(SecurityMiddleware)

# Routers
app.include_router(stadium.router, prefix=settings.API_PREFIX)
app.include_router(medical.router, prefix=settings.API_PREFIX)
app.include_router(security.router, prefix=settings.API_PREFIX)
app.include_router(vendor.router, prefix=settings.API_PREFIX)
app.include_router(transport.router, prefix=settings.API_PREFIX)
app.include_router(ai.router, prefix=settings.API_PREFIX)
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(simulation.router, prefix=settings.API_PREFIX)
app.include_router(operations.router, prefix=settings.API_PREFIX)


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "services": {
            "api": "online",
            "ai": "online" if settings.OPENAI_API_KEY else "offline",
            "database": "mock" if settings.USE_MOCK_DATA else "online",
        },
    }


@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "api": f"{settings.API_PREFIX}",
    }


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time stadium data."""
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo back or handle client messages
            await manager.send_personal(websocket, {
                "type": "echo",
                "data": data,
                "timestamp": datetime.utcnow().isoformat(),
            })
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.websocket("/ws/{room}")
async def websocket_room_endpoint(websocket: WebSocket, room: str):
    """WebSocket endpoint with room support."""
    await manager.connect(websocket, room)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, room)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "detail": str(exc) if settings.DEBUG else "An unexpected error occurred",
        },
    )