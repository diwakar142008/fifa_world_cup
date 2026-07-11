"""Tests for AI API endpoints."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestAIEndpoints:
    """Test AI chat, summary, predictions, and knowledge base."""

    def test_ai_chat_endpoint(self):
        """Test AI chat returns response."""
        response = client.post(
            "/api/v1/ai/chat",
            json={"messages": [{"role": "user", "content": "Hello"}]},
        )
        assert response.status_code == 200
        data = response.json()
        assert "response" in data["data"]
        assert "confidence" in data["data"]

    def test_ai_chat_with_session(self):
        """Test AI chat with session ID."""
        response = client.post(
            "/api/v1/ai/chat",
            json={
                "messages": [{"role": "user", "content": "Test message"}],
                "session_id": "test-session-123",
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["session_id"] == "test-session-123"

    def test_ai_chat_empty_message(self):
        """Test AI chat rejects empty message."""
        response = client.post(
            "/api/v1/ai/chat",
            json={"messages": []},
        )
        assert response.status_code == 400

    def test_ai_summary_endpoint(self):
        """Test AI summary generation."""
        response = client.get("/api/v1/ai/summary")
        assert response.status_code == 200
        data = response.json()
        assert "headline" in data["data"]
        assert "narrative" in data["data"]
        assert "risk_level" in data["data"]

    def test_ai_predictions_endpoint(self):
        """Test AI predictions."""
        response = client.get("/api/v1/ai/predictions")
        assert response.status_code == 200
        data = response.json()
        assert "predictions" in data["data"]
        assert isinstance(data["data"]["predictions"], list)

    def test_knowledge_base_stats(self):
        """Test knowledge base statistics."""
        response = client.get("/api/v1/ai/knowledge")
        assert response.status_code == 200
        data = response.json()
        assert "total_documents" in data["data"]
        assert data["data"]["total_documents"] > 0

    def test_knowledge_base_query(self):
        """Test querying knowledge base."""
        response = client.post(
            "/api/v1/ai/knowledge/query?query=stadium&top_k=2"
        )
        assert response.status_code == 200
        data = response.json()
        assert "results" in data["data"]
        assert "count" in data["data"]
        assert data["data"]["count"] <= 2

    def test_ai_fallback_without_api_key(self):
        """Test AI returns fallback when API key not set."""
        # When OPENAI_API_KEY is not configured
        response = client.post(
            "/api/v1/ai/chat",
            json={"messages": [{"role": "user", "content": "Test"}]},
        )
        # Should still return 200 with fallback message
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert "response" in data["data"]