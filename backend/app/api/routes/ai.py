"""AI chat, predictions, and intelligence API endpoints.

Provides access to the multi-model AI service with streaming, 
predictions, summaries, and model status monitoring.
"""

import logging
from fastapi import APIRouter, HTTPException, Query
from app.schemas.base import APIResponse
from app.schemas.stadium import AIChatRequest
from app.services.ai_service import ai_service
from app.services.rag_service import rag_service

logger = logging.getLogger("stadiummind.api.ai")

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/chat", summary="AI Chat Completion")
async def ai_chat(request: AIChatRequest):
    """Process an AI chat request with real LLM integration and RAG context.

    Returns a complete response with confidence score and reasoning.
    Falls back to rule-based responses if no AI model is configured.
    """
    user_msg = request.messages[-1].content if request.messages else ""
    if not user_msg:
        raise HTTPException(status_code=400, detail="No message provided")

    logger.info(f"AI chat request from session '{request.session_id or 'default'}'")

    full_response = ""
    async for chunk in ai_service.chat_stream(
        message=user_msg,
        session_id=request.session_id or "default",
        user_context={"role": request.role or "user"},
    ):
        full_response += chunk

    return APIResponse(data={
        "response": full_response,
        "confidence": 0.9,
        "risk_level": "low",
        "recommendations": [],
        "alternative_actions": [],
        "reasoning": "AI response generated with LLM and optional RAG context",
        "session_id": request.session_id or "default",
    })


@router.post("/chat-stream", summary="Streaming AI Chat")
async def ai_chat_stream(request: AIChatRequest):
    """Streaming chat endpoint returning chunks via Server-Sent Events.

    Use this endpoint for real-time chat UIs that require token-by-token display.
    """
    from fastapi.responses import StreamingResponse

    user_msg = request.messages[-1].content if request.messages else ""

    async def generate():
        async for chunk in ai_service.chat_stream(
            message=user_msg,
            session_id=request.session_id or "default",
            user_context={"role": request.role or "user"},
        ):
            yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


@router.get("/summary", summary="Stadium Operations Summary")
async def get_ai_summary():
    """Get AI-generated summary of current stadium status.

    Returns headline, narrative, risk level, confidence score, key insights,
    and top recommendations. Uses the best available AI model.
    """
    logger.info("AI summary requested")
    summary = await ai_service.generate_summary({})
    return APIResponse(data=summary)


@router.get("/predictions", summary="Crowd Congestion Predictions")
async def get_ai_predictions():
    """Get AI predictions for crowd movement and congestion zones.

    Returns predicted congestion zones with probability scores, peak times,
    recommendations, and confidence level. Falls back to rule-based
    predictions if no AI model is available.
    """
    logger.info("AI predictions requested")
    predictions = await ai_service.generate_predictions({})
    return APIResponse(data=predictions)


@router.get("/models", summary="AI Model Status")
async def get_model_status():
    """Get status of all configured AI models.

    Reports availability of OpenAI, Anthropic, and Gemini models
    with their respective model versions and fallback status.
    """
    status = await ai_service.get_model_status()
    return APIResponse(data=status)


@router.get("/knowledge", summary="Knowledge Base Stats")
async def get_knowledge_base():
    """Get knowledge base statistics (document count, sources, etc.)."""
    stats = await rag_service.get_stats()
    return APIResponse(data=stats)


@router.post("/knowledge/query", summary="Query Knowledge Base")
async def query_knowledge(
    query: str = Query(..., description="Search query"),
    top_k: int = Query(3, description="Number of results to return", ge=1, le=20),
):
    """Query the knowledge base for relevant documents.

    Uses semantic search to find the most relevant information
    for the given query from the stadium operations knowledge base.
    """
    results = await rag_service.retrieve(query, top_k)
    return APIResponse(data={"results": results, "count": len(results)})