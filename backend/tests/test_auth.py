"""Tests for authentication endpoints."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestAuthentication:
    """Test JWT authentication, bcrypt, and RBAC."""

    def test_login_with_valid_credentials(self):
        """Test successful login returns JWT token."""
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "admin@stadiummind.ai", "password": "changeme-in-prod!"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert "access_token" in data["data"]
        assert data["data"]["token_type"] == "bearer"
        assert data["data"]["role"] == "organizer"

    def test_login_with_invalid_password(self):
        """Test login fails with wrong password."""
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "admin@stadiummind.ai", "password": "wrong"},
        )
        assert response.status_code == 401
        assert "Invalid credentials" in response.json()["detail"]

    def test_login_with_nonexistent_user(self):
        """Test login fails for unknown email."""
        response = client.post(
            "/api/v1/auth/login",
            json={"email": "nonexistent@example.com", "password": "test"},
        )
        assert response.status_code == 401

    def test_get_current_user_without_token(self):
        """Test protected endpoint rejects missing token."""
        response = client.get("/api/v1/auth/me")
        assert response.status_code == 401

    def test_get_current_user_with_valid_token(self):
        """Test protected endpoint accepts valid JWT."""
        # First login
        login_resp = client.post(
            "/api/v1/auth/login",
            json={"email": "admin@stadiummind.ai", "password": "changeme-in-prod!"},
        )
        token = login_resp.json()["data"]["access_token"]

        # Then access protected route
        response = client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["role"] == "organizer"

    def test_refresh_token(self):
        """Test token refresh endpoint."""
        login_resp = client.post(
            "/api/v1/auth/login",
            json={"email": "admin@stadiummind.ai", "password": "changeme-in-prod!"},
        )
        token = login_resp.json()["data"]["access_token"]

        response = client.post(
            "/api/v1/auth/refresh",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 200
        assert "access_token" in response.json()["data"]

    def test_logout(self):
        """Test logout endpoint."""
        login_resp = client.post(
            "/api/v1/auth/login",
            json={"email": "admin@stadiummind.ai", "password": "changeme-in-prod!"},
        )
        token = login_resp.json()["data"]["access_token"]

        response = client.post(
            "/api/v1/auth/logout",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert response.status_code == 200