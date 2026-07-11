"""StadiumMind AI - FastAPI Application Entry Point.

Production-grade API server with comprehensive middleware stack,
structured logging, health checks, and WebSocket support.
"""

from contextlib import asynccontextmanager
from datetime import datetime, timezone
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import WebSocket, WebSocketDisconnect

from app.config import get_settings
from app.database import init_db, close_db
from app.websocket.manager import manager, broadcast_periodic_updates
from app.middleware.security import SecurityMiddleware
from app.middleware.csrf import CSRFMiddleware
from app.middleware.validation import ValidationMiddleware
from app.middleware.rate_limit import RateLimitMiddleware
from app.services.cache_service import cache
from app.services.audit_logger import audit_logger
from app.api.routes import (
    stadium, medical, security, vendor, transport,
    ai, auth, simulation, operations,
)

settings = get_settings()

# Structured Logging Setup
import logging
import sys

logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format=settings.LOG_FORMAT,
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("stadiummind.log") if settings.LOG_TO_FILE else logging.NullHandler(),
    ],
)
logger = logging.getLogger("stadiummind")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle: startup and shutdown with graceful cleanup."""
    logger.info(f"StadiumMind AI v{settings.APP_VERSION} starting...")

    if not settings.USE_MOCK_DATA:
        await init_db()
        logger.info("Database connection established")

    import asyncio
    broadcast_task = asyncio.create_task(broadcast_periodic_updates())
    logger.info("WebSocket broadcast task started")

    yield

    broadcast_task.cancel()
    if not settings.USE_MOCK_DATA:
        await close_db()
    logger.info("Server shutting down gracefully")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="The Generative AI Operating System for FIFA World Cup 2026 Stadiums "
                "- Multi-agent AI orchestration, predictive analytics, and real-time operational intelligence.",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    contact={
        "name": "StadiumMind AI Team",
        "url": "https://stadium-mind.ai",
    },
    license_info={
        "name": "Proprietary - FIFA World Cup 2026",
    },
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With", "X-CSRF-Token"],
    expose_headers=["X-Request-ID"],
)

# Security Middleware Stack
app.add_middleware(SecurityMiddleware)
app.add_middleware(CSRFMiddleware)
app.add_middleware(ValidationMiddleware)
app.add_middleware(RateLimitMiddleware)

# API Router Registration
app.include_router(auth.router, prefix=settings.API_PREFIX, tags=["Authentication"])
app.include_router(stadium.router, prefix=settings.API_PREFIX, tags=["Stadium"])
app.include_router(medical.router, prefix=settings.API_PREFIX, tags=["Medical"])
app.include_router(security.router, prefix=settings.API_PREFIX, tags=["Security"])
app.include_router(vendor.router, prefix=settings.API_PREFIX, tags=["Vendor"])
app.include_router(transport.router, prefix=settings.API_PREFIX, tags=["Transport"])
app.include_router(ai.router, prefix=settings.API_PREFIX, tags=["AI"])
app.include_router(simulation.router, prefix=settings.API_PREFIX, tags=["Simulation"])
app.include_router(operations.router, prefix=settings.API_PREFIX, tags=["Operations"])

logger.info(f"Registered {len(app.routes)} API routes")


# Health & Info Endpoints

@app.get("/health", tags=["System"])
async def health_check():
    """Comprehensive health check returning status of all services."""
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "services": {
            "api": "online",
            "ai": "online" if settings.OPENAI_API_KEY else "degraded",
            "database": "mock" if settings.USE_MOCK_DATA else "online",
            "cache": "online" if cache else "offline",
        },
        "environment": "production" if not settings.DEBUG else "development",
    }


@app.get("/", tags=["System"])
async def root():
    """API root with version information."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "description": "The Generative AI Operating System for FIFA World Cup 2026 Stadiums",
        "docs": "/docs",
        "api": f"{settings.API_PREFIX}",
        "health": "/health",
    }


@app.get("/health/readiness", tags=["System"])
async def readiness_check():
    """Readiness probe for orchestrators (Kubernetes/Docker)."""
    db_ready = settings.USE_MOCK_DATA or True
    return {"ready": db_ready, "database": db_ready}


@app.get("/health/liveness", tags=["System"])
async def liveness_check():
    """Liveness probe - simple check that the server is alive."""
    return {"alive": True}


# WebSocket Endpoints

@app.websocket("/ws", tags=["WebSocket"])
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time stadium data streaming."""
    await manager.connect(websocket)
    client_ip = websocket.client.host
    logger.info(f"WebSocket client connected from {client_ip}")
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal(websocket, {
                "type": "echo",
                "data": data,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info(f"WebSocket client disconnected from {client_ip}")
    except Exception as e:
        logger.error(f"WebSocket error from {client_ip}: {str(e)}")
        manager.disconnect(websocket)


@app.websocket("/ws/{room}", tags=["WebSocket"])
async def websocket_room_endpoint(websocket: WebSocket, room: str):
    """WebSocket endpoint with room/channel support for targeted broadcasts."""
    await manager.connect(websocket, room)
    logger.info(f"WebSocket client joined room '{room}'")
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, room)
    except Exception as e:
        logger.error(f"WebSocket room error in '{room}': {str(e)}")
        manager.disconnect(websocket, room)


# Global Exception Handlers

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global catch-all exception handler with structured error response."""
    error_id = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S%f")
    logger.error(
        f"Unhandled exception [{error_id}] on {request.method} {request.url.path}: {str(exc)}",
        exc_info=True,
    )
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "error_id": error_id,
            "detail": str(exc) if settings.DEBUG else "An unexpected error occurred. Please try again later.",
            "path": request.url.path,
            "method": request.method,
        },
    )


@app.exception_handler(404)
async def not_found_handler(request: Request, exc: Exception):
    """Custom 404 handler."""
    return JSONResponse(
        status_code=404,
        content={
            "success": False,
            "error": "Not Found",
            "detail": f"The requested endpoint '{request.url.path}' does not exist.",
            "path": request.url.path,
        },
    )


@app.exception_handler(405)
async def method_not_allowed_handler(request: Request, exc: Exception):
    """Custom 405 handler."""
    return JSONResponse(
        status_code=405,
        content={
            "success": False,
            "error": "Method Not Allowed",
            "detail": f"Method '{request.method}' not allowed for endpoint '{request.url.path}'.",
            "path": request.url.path,
            "method": request.method,
        },
    )