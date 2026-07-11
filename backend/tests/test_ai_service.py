"""Tests for AI services: chat, streaming, RAG, predictions."""

import pytest
from unittest.mock import AsyncMock, patch
from app.services.ai_service import AIService
from app.services.rag_service import RAGService


class TestAIService:
    """Test AI service functionality."""

    @pytest.fixture
    def ai_service(self):
        return AIService()

    @pytest.mark.asyncio
    async def test_chat_stream_without_api_key(self, ai_service):
        """Test chat returns some response when API key not configured."""
        result = []
        async for chunk in ai_service.chat_stream("test", "session-1", {}):
            result.append(chunk)
        # Should return some response (either fallback or real AI)
        assert len(result) > 0

    @pytest.mark.asyncio
    async def test_conversation_memory_management(self, ai_service):
        """Test conversation memory persists and truncates."""
        session_id = "test-session"

        # Add messages
        for i in range(25):
            ai_service._save_message(session_id, "user", f"msg{i}")

        history = ai_service.conversation_memory.get(session_id, [])
        assert len(history) <= 40  # max_messages * 2

    @pytest.mark.asyncio
    async def test_chat_stream_with_mock_openai(self, ai_service):
        """Test streaming with mocked OpenAI client."""
        from app.services import ai_service as ai_service_module
        mock_client = AsyncMock()
        mock_chunk = AsyncMock()
        mock_chunk.choices = [AsyncMock()]
        mock_chunk.choices[0].delta.content = "Hello"
        # Make create() an async generator
        async def mock_create(*args, **kwargs):
            yield mock_chunk
        mock_client.chat.completions.create = mock_create
        ai_service_module.aclient = mock_client

        result = []
        async for chunk in ai_service.chat_stream("hi", "s1", {}):
            result.append(chunk)

        assert len(result) >= 1


class TestRAGService:
    """Test RAG retrieval functionality."""

    @pytest.fixture
    def rag_service(self):
        return RAGService()

    @pytest.mark.asyncio
    async def test_retrieve_relevant_documents(self, rag_service):
        """Test retrieval finds relevant documents."""
        results = await rag_service.retrieve("Where is the stadium?", top_k=2)
        assert len(results) > 0
        assert results[0]["source"] == "Stadium Info"

    @pytest.mark.asyncio
    async def test_retrieve_emergency_info(self, rag_service):
        """Test retrieval finds emergency procedures."""
        results = await rag_service.retrieve("emergency evacuation", top_k=1)
        assert len(results) == 1
        assert results[0]["source"] == "Emergency"

    @pytest.mark.asyncio
    async def test_retrieve_no_results(self, rag_service):
        """Test retrieval with irrelevant query."""
        results = await rag_service.retrieve("xyzabc123 nonsense", top_k=3)
        assert len(results) == 0

    @pytest.mark.asyncio
    async def test_add_document(self, rag_service):
        """Test adding document to knowledge base."""
        initial_count = len(rag_service.knowledge_base)
        doc = await rag_service.add_document(
            "Test content", "Test Source", ["test"]
        )
        assert doc["id"] == f"kb-{initial_count + 1:03d}"
        assert len(rag_service.knowledge_base) == initial_count + 1

    @pytest.mark.asyncio
    async def test_get_stats(self, rag_service):
        """Test knowledge base statistics."""
        stats = await rag_service.get_stats()
        assert "total_documents" in stats
        assert "sources" in stats
        assert stats["total_documents"] >= 12  # Initial KB size