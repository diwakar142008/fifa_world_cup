"""Comprehensive tests for the AI Service module.

Tests cover:
- Model availability and fallback logic
- Chat streaming and non-streaming
- Summary generation
- Prediction generation
- Error handling and edge cases
- Conversation memory management
"""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from datetime import datetime, timezone

from app.services.ai_service import AIService, AIResponse


@pytest.fixture
def ai_service():
    """Create AI service instance with mocked clients."""
    service = AIService()
    # Mock all clients as unavailable for unit tests
    service._available_models = {
        "openai": False,
        "anthropic": False,
        "gemini": False,
    }
    return service


class TestAIServiceInitialization:
    """Test AI service initialization and model detection."""

    def test_service_initialization(self, ai_service):
        """Test that service initializes with correct defaults."""
        assert ai_service.max_messages == 20
        assert ai_service.conversation_memory == {}
        assert ai_service._model_priority == ["openai", "anthropic", "gemini"]

    def test_no_models_available(self, ai_service):
        """Test behavior when no AI models are configured."""
        model_name, client = ai_service._get_available_model()
        assert model_name is None
        assert client is None

    def test_get_active_model_name_none(self, ai_service):
        """Test active model name when none available."""
        assert ai_service._get_active_model_name() == "none"


class TestAIServiceFallback:
    """Test fallback behavior when AI models are unavailable."""

    @pytest.mark.asyncio
    async def test_chat_stream_fallback(self, ai_service):
        """Test chat stream returns fallback message when no model available."""
        chunks = []
        async for chunk in ai_service.chat_stream("test message", "session_1"):
            chunks.append(chunk)
        assert len(chunks) == 1
        assert "offline mode" in chunks[0]

    def test_default_summary(self, ai_service):
        """Test default summary when AI unavailable."""
        summary = ai_service._default_summary()
        assert summary["headline"] == "Stadium operations normal"
        assert summary["confidence_score"] == 0.5
        assert summary["model_used"] == "none"
        assert "AI service not configured" in summary["key_insights"]

    def test_default_predictions_low_occupancy(self, ai_service):
        """Test default predictions with low occupancy."""
        predictions = ai_service._default_predictions(50.0)
        assert len(predictions["predictions"]) == 0
        assert predictions["confidence_score"] == 0.6
        assert predictions["model_used"] == "rule-based-fallback"

    def test_default_predictions_high_occupancy(self, ai_service):
        """Test default predictions with high occupancy (>90%)."""
        predictions = ai_service._default_predictions(92.0)
        assert len(predictions["predictions"]) == 1
        assert predictions["predictions"][0]["zone"] == "Main Concourse"
        assert predictions["predictions"][0]["congestion_probability"] == 0.85

    def test_default_predictions_medium_occupancy(self, ai_service):
        """Test default predictions with medium occupancy (75-90%)."""
        predictions = ai_service._default_predictions(80.0)
        assert len(predictions["predictions"]) == 1
        assert predictions["predictions"][0]["zone"] == "Gate Areas"

    def test_fallback_response(self, ai_service):
        """Test fallback response text."""
        response = ai_service._get_fallback_response("chat")
        assert "offline mode" in response

    def test_fallback_response_unknown_type(self, ai_service):
        """Test fallback with unknown response type."""
        response = ai_service._get_fallback_response("unknown")
        assert "Service unavailable" in response


class TestAIServiceMemory:
    """Test conversation memory management."""

    def test_save_message_creates_session(self, ai_service):
        """Test saving a message creates a new session."""
        ai_service._save_message("session_1", "user", "Hello")
        assert "session_1" in ai_service.conversation_memory
        assert len(ai_service.conversation_memory["session_1"]) == 1

    def test_save_message_appends_to_existing(self, ai_service):
        """Test saving messages appends to existing session."""
        ai_service._save_message("session_1", "user", "Hello")
        ai_service._save_message("session_1", "assistant", "Hi there")
        assert len(ai_service.conversation_memory["session_1"]) == 2

    def test_save_message_includes_timestamp(self, ai_service):
        """Test saved messages include ISO timestamp."""
        ai_service._save_message("session_1", "user", "Hello")
        msg = ai_service.conversation_memory["session_1"][0]
        assert "timestamp" in msg
        assert "T" in msg["timestamp"]  # ISO format check

    def test_memory_trimming(self, ai_service):
        """Test memory is trimmed when exceeding max_messages * 2."""
        ai_service.max_messages = 3
        for i in range(10):
            ai_service._save_message("session_1", "user", f"Message {i}")
        assert len(ai_service.conversation_memory["session_1"]) <= 6  # max_messages * 2

    def test_build_conversation_context(self, ai_service):
        """Test building conversation context with history."""
        ai_service._save_message("session_1", "user", "Previous question")
        ai_service._save_message("session_1", "assistant", "Previous answer")
        messages = ai_service._build_conversation_context("session_1", "New question")
        assert len(messages) == 4  # system + 2 history + user
        assert messages[0]["role"] == "system"
        assert messages[-1]["role"] == "user"
        assert messages[-1]["content"] == "New question"

    def test_build_conversation_context_no_history(self, ai_service):
        """Test building context without existing history."""
        messages = ai_service._build_conversation_context("new_session", "Hello")
        assert len(messages) == 2  # system + user
        assert messages[0]["role"] == "system"
        assert messages[1]["role"] == "user"


class TestAIServiceJSONParsing:
    """Test JSON response parsing from AI models."""

    def test_parse_valid_json(self, ai_service):
        """Test parsing valid JSON string."""
        result = ai_service._parse_json_response('{"key": "value", "number": 42}')
        assert result["key"] == "value"
        assert result["number"] == 42

    def test_parse_invalid_json(self, ai_service):
        """Test parsing invalid JSON returns empty dict."""
        result = ai_service._parse_json_response("not json at all")
        assert result == {}

    def test_parse_json_in_markdown(self, ai_service):
        """Test parsing JSON embedded in markdown code block."""
        response = '```json\n{"key": "value"}\n```'
        result = ai_service._parse_json_response(response)
        assert result["key"] == "value"

    def test_parse_empty_string(self, ai_service):
        """Test parsing empty string."""
        result = ai_service._parse_json_response("")
        assert result == {}

    def test_parse_nested_json(self, ai_service):
        """Test parsing nested JSON structures."""
        response = '{"predictions": [{"zone": "A", "probability": 0.9}], "meta": {"version": 1}}'
        result = ai_service._parse_json_response(response)
        assert len(result["predictions"]) == 1
        assert result["meta"]["version"] == 1


class TestAIServiceWithMockedModels:
    """Test AI service with mocked model clients."""

    @pytest.mark.asyncio
    async def test_generate_summary_with_openai(self):
        """Test summary generation with mocked OpenAI client."""
        service = AIService()
        mock_client = AsyncMock()
        mock_response = MagicMock()
        mock_response.choices = [MagicMock()]
        mock_response.choices[0].message.content = (
            '{"headline": "Test", "narrative": "Test narrative", '
            '"risk_level": "low", "confidence_score": 0.9, '
            '"key_insights": ["Test"], "top_recommendations": []}'
        )
        mock_client.chat.completions.create = AsyncMock(return_value=mock_response)

        # Manually inject mock
        service._available_models = {"openai": True, "anthropic": False, "gemini": False}

        with patch.object(service, '_get_available_model', return_value=("openai", mock_client)):
            with patch.object(service, '_call_model', return_value=(
                '{"headline": "Test", "narrative": "Test narrative", '
                '"risk_level": "low", "confidence_score": 0.9, '
                '"key_insights": ["Test"], "top_recommendations": []}'
            )):
                summary = await service.generate_summary({"occupancy_pct": 50, "current_attendance": 30000})
                assert summary["headline"] == "Test"
                assert summary["confidence_score"] == 0.9
                assert "model_used" in summary
                assert "processing_time_ms" in summary

    @pytest.mark.asyncio
    async def test_generate_summary_error_handling(self, ai_service):
        """Test summary generation handles errors gracefully."""
        # When no model is available, should return default summary
        summary = await ai_service.generate_summary({})
        assert summary["headline"] == "Stadium operations normal"
        assert summary["confidence_score"] == 0.5
        assert summary["model_used"] == "none"

    @pytest.mark.asyncio
    async def test_generate_predictions_with_data(self, ai_service):
        """Test prediction generation with provided data."""
        data = {"current_attendance": 50000, "occupancy_pct": 85, "open_gates": 4, "total_gates": 6}
        predictions = await ai_service.generate_predictions(data)
        assert "predictions" in predictions
        assert "confidence_score" in predictions
        assert "model_used" in predictions

    @pytest.mark.asyncio
    async def test_chat_stream_error_handling(self, ai_service):
        """Test chat stream handles errors gracefully."""
        with patch.object(ai_service, '_build_conversation_context', side_effect=Exception("Test error")):
            chunks = []
            async for chunk in ai_service.chat_stream("test", "session_1"):
                chunks.append(chunk)
            assert len(chunks) == 1
            assert "error" in chunks[0].lower()


class TestAIServiceModelStatus:
    """Test model status reporting."""

    @pytest.mark.asyncio
    async def test_get_model_status_all_offline(self, ai_service):
        """Test model status when all models are offline."""
        status = await ai_service.get_model_status()
        assert status["active_model"] == "none"
        assert status["fallback_enabled"] is False
        for model in ["openai", "anthropic", "gemini"]:
            assert status["models"][model]["available"] is False

    @pytest.mark.asyncio
    async def test_get_model_status_one_online(self):
        """Test model status with one model online."""
        service = AIService()
        service._available_models = {"openai": True, "anthropic": False, "gemini": False}
        status = await service.get_model_status()
        assert status["active_model"] == "openai"
        assert status["fallback_enabled"] is False

    @pytest.mark.asyncio
    async def test_get_model_status_multiple_online(self):
        """Test model status with multiple models online (fallback enabled)."""
        service = AIService()
        service._available_models = {"openai": True, "anthropic": True, "gemini": False}
        status = await service.get_model_status()
        assert status["active_model"] == "openai"
        assert status["fallback_enabled"] is True


class TestAIResponseDataclass:
    """Test AIResponse dataclass."""

    def test_default_values(self):
        """Test AIResponse default values."""
        response = AIResponse(content="Test")
        assert response.content == "Test"
        assert response.confidence_score == 0.0
        assert response.risk_level == "low"
        assert response.model_used == "unknown"
        assert response.recommendations == []
        assert response.fallback_used is False

    def test_custom_values(self):
        """Test AIResponse with custom values."""
        response = AIResponse(
            content="Test",
            confidence_score=0.95,
            risk_level="high",
            model_used="gpt-4",
            reasoning="High confidence prediction",
            recommendations=["Action 1", "Action 2"],
            processing_time_ms=150.5,
        )
        assert response.confidence_score == 0.95
        assert response.risk_level == "high"
        assert len(response.recommendations) == 2
        assert response.processing_time_ms == 150.5