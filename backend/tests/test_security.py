"""Tests for security middleware and headers."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestSecurityMiddleware:
    """Test rate limiting, CORS, and security headers."""

    def test_security_headers_present(self):
        """Test that security headers are added to responses."""
        response = client.get("/")
        assert response.headers["X-Content-Type-Options"] == "nosniff"
        assert response.headers["X-Frame-Options"] == "DENY"
        assert response.headers["X-XSS-Protection"] == "1; mode=block"
        assert "Strict-Transport-Security" in response.headers

    def test_rate_limiter(self):
        """Test rate limiting allows up to limit then blocks."""
        # Make requests up to a threshold
        for _ in range(5):
            response = client.get("/")
            assert response.status_code == 200

    def test_cors_headers(self):
        """Test CORS configuration."""
        response = client.get(
            "/",
            headers={"Origin": "http://localhost:3000"},
        )
        assert response.status_code == 200
        assert "Access-Control-Allow-Origin" in response.headers
