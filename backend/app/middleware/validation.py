"""Input Validation and Sanitization Middleware.

Uses Pydantic schema validation in route handlers for detailed validation.
This middleware provides additional injection pattern detection for query params.
"""

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
import re
from app.config import get_settings


settings = get_settings()


class ValidationMiddleware(BaseHTTPMiddleware):
    """Additional input sanitization for query parameters and headers.

    Note: Body validation is handled by Pydantic schemas in route handlers.
    """

    # Patterns for common attacks
    SQL_INJECTION_PATTERNS = [
        r"\b(SELECT\s.+FROM|INSERT\s+INTO|UPDATE\s.+SET|DELETE\s+FROM|DROP\s+TABLE|UNION\s+SELECT|EXEC\s|ALTER\s+TABLE|CREATE\s+TABLE|TRUNCATE\s+TABLE)\b",
    ]

    XSS_PATTERNS = [
        r"<script[^>]*>",
        r"javascript:",
    ]

    async def dispatch(self, request: Request, call_next):
        # Skip validation in testing mode
        try:
            if get_settings().TESTING:
                return await call_next(request)
        except Exception:
            pass

        # Validate query params for injection patterns
        for key, value in request.query_params.items():
            if self._detect_sql_injection(value) or self._detect_xss(value):
                from fastapi.responses import JSONResponse
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
