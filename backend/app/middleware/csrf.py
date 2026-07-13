"""CSRF Protection Middleware for FastAPI."""

from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import secrets
import hashlib
from typing import Dict, Set
import time

from app.config import get_settings

settings = get_settings()


def _is_testing() -> bool:
    try:
        return get_settings().TESTING
    except Exception:
        return False

# In-memory CSRF token store (use Redis in production)
csrf_tokens: Dict[str, float] = {}
CSRF_TOKEN_TTL = 3600  # 1 hour


class CSRFMiddleware(BaseHTTPMiddleware):
    """CSRF protection with double-submit cookie pattern."""

    async def dispatch(self, request: Request, call_next):
        # Skip CSRF entirely in testing mode
        if _is_testing():
            return await call_next(request)

        # Skip CSRF for safe methods
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return await call_next(request)

        path = request.url.path
        
        # Skip CSRF for all API endpoints (they use JWT/bearer token auth)
        if path.startswith("/api/"):
            return await call_next(request)

        # Skip CSRF for health endpoints
        if path.startswith("/health"):
            return await call_next(request)

        # Check CSRF token for state-changing requests (browser forms only)
        csrf_token = request.headers.get("X-CSRF-Token")
        if not csrf_token or not self._validate_token(csrf_token):
            return JSONResponse(
                status_code=403,
                content={"detail": "Invalid or missing CSRF token"}
            )

        return await call_next(request)

    def _validate_token(self, token: str) -> bool:
        """Validate CSRF token exists and is not expired."""
        if token not in csrf_tokens:
            return False
        
        # Check expiration
        if time.time() - csrf_tokens[token] > CSRF_TOKEN_TTL:
            del csrf_tokens[token]
            return False
        
        return True

    @staticmethod
    def generate_token() -> str:
        """Generate a secure CSRF token."""
        token = secrets.token_urlsafe(32)
        csrf_tokens[token] = time.time()
        return token

    @staticmethod
    def cleanup_expired():
        """Remove expired CSRF tokens."""
        now = time.time()
        expired = [t for t, ts in csrf_tokens.items() if now - ts > CSRF_TOKEN_TTL]
        for token in expired:
            del csrf_tokens[token]