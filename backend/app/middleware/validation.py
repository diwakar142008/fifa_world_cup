"""Input Validation and Sanitization Middleware."""

from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import re
import html
from app.config import get_settings

settings = get_settings()


def _is_testing() -> bool:
    try:
        return get_settings().TESTING
    except Exception:
        return False


class ValidationMiddleware(BaseHTTPMiddleware):
    """Validates and sanitizes input to prevent injection attacks."""

    # Patterns for common attacks
    SQL_INJECTION_PATTERNS = [
        r"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)\b)",
        r"(--|\#|\/\*|\*\/)",
        r"('|\"|;|\\x00|\\n|\\r|\\x1a)",
    ]

    XSS_PATTERNS = [
        r"<script[^>]*>",
        r"javascript:",
        r"onerror\s*=",
        r"onclick\s*=",
        r"<iframe",
        r"<embed",
        r"<object",
    ]

    async def dispatch(self, request: Request, call_next):
        # Skip validation in testing mode
        if _is_testing():
            return await call_next(request)

        # Skip validation for safe methods
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return await call_next(request)

        # Validate request body for JSON content
        if request.headers.get("content-type", "").startswith("application/json"):
            body = await request.body()
            if body:
                body_str = body.decode('utf-8', errors='ignore')
                if self._detect_sql_injection(body_str) or self._detect_xss(body_str):
                    return JSONResponse(
                        status_code=400,
                        content={"detail": "Invalid input detected"}
                    )

        return await call_next(request)

    def _detect_sql_injection(self, text: str) -> bool:
        """Detect potential SQL injection patterns."""
        text_lower = text.lower()
        for pattern in self.SQL_INJECTION_PATTERNS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                return True
        return False

    def _detect_xss(self, text: str) -> bool:
        """Detect potential XSS patterns."""
        text_lower = text.lower()
        for pattern in self.XSS_PATTERNS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                return True
        return False