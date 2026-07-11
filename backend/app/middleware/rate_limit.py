"""Rate Limiting Middleware for API protection.

Implements token bucket rate limiting per IP address with configurable
limits and window durations. Prevents API abuse and DDoS attacks.
"""

import time
import logging
from collections import defaultdict
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

from app.config import get_settings

logger = logging.getLogger("stadiummind.ratelimit")

settings = get_settings()


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Token bucket rate limiter per IP address.

    Limits requests to RATE_LIMIT_REQUESTS per RATE_LIMIT_WINDOW_SECONDS.
    Returns 429 Too Many Requests when limit exceeded.
    """

    def __init__(self, app):
        super().__init__(app)
        self._request_counts: dict[str, list[float]] = defaultdict(list)
        self._max_requests = settings.RATE_LIMIT_REQUESTS
        self._window_seconds = settings.RATE_LIMIT_WINDOW_SECONDS
        self._whitelisted_paths = {"/health", "/health/readiness", "/health/liveness", "/", "/docs", "/redoc", "/openapi.json"}

    async def dispatch(self, request: Request, call_next) -> Response:
        # Skip rate limiting for whitelisted paths
        if request.url.path in self._whitelisted_paths:
            return await call_next(request)

        # Skip rate limiting in testing mode
        if settings.TESTING:
            return await call_next(request)

        client_ip = self._get_client_ip(request)
        now = time.time()

        # Clean old entries
        self._request_counts[client_ip] = [
            t for t in self._request_counts[client_ip]
            if now - t < self._window_seconds
        ]

        # Check rate limit
        if len(self._request_counts[client_ip]) >= self._max_requests:
            logger.warning(f"Rate limit exceeded for IP: {client_ip}")
            return JSONResponse(
                status_code=429,
                content={
                    "success": False,
                    "error": "Too Many Requests",
                    "detail": f"Rate limit of {self._max_requests} requests per {self._window_seconds} seconds exceeded.",
                    "retry_after_seconds": int(self._window_seconds),
                },
                headers={
                    "Retry-After": str(self._window_seconds),
                    "X-RateLimit-Limit": str(self._max_requests),
                    "X-RateLimit-Remaining": "0",
                },
            )

        # Record request
        self._request_counts[client_ip].append(now)

        response = await call_next(request)

        # Add rate limit headers
        remaining = max(0, self._max_requests - len(self._request_counts[client_ip]))
        response.headers["X-RateLimit-Limit"] = str(self._max_requests)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Reset"] = str(int(now + self._window_seconds))

        return response

    @staticmethod
    def _get_client_ip(request: Request) -> str:
        """Extract client IP from request, respecting proxy headers."""
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip.strip()
        return request.client.host if request.client else "unknown"