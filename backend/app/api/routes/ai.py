"""AI chat, predictions, and intelligence API endpoints with real LLM integration."""

from fastapi import APIRouter, HTTPException, Depends
from app.schemas.base import APIResponse
from app.schemas.stadium import AIChatRequest, AIChatResponse
from app.services.ai_service import ai_service
from app.services.rag_service import rag_service

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/chat")
async def ai_chat(request: AIChatRequest):
    """Process an AI chat request with real LLM and RAG."""
    user_msg = request.messages[-1].content if request.messages else ""
    if not user_msg:
        raise HTTPException(status_code=400, detail="No message provided")

    # Use real AI with RAG
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
        "reasoning": "AI response generated with RAG context",
        "session_id": request.session_id or "default",
    })


@router.post("/chat-stream")
async def ai_chat_stream(request: AIChatRequest):
    """Streaming chat endpoint - returns chunks via Server-Sent Events."""
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


@router.get("/summary")
async def get_ai_summary():
    """Get AI-generated summary of current stadium status."""
    summary = await ai_service.generate_summary({})
    return APIResponse(data=summary)


@router.get("/predictions")
async def get_ai_predictions():
    """Get AI predictions for crowd movement and congestion."""
    predictions = await ai_service.generate_predictions({})
    return APIResponse(data=predictions)


@router.get("/knowledge")
async def get_knowledge_base():
    """Get knowledge base statistics."""
    stats = await rag_service.get_stats()
    return APIResponse(data=stats)


@router.post("/knowledge/query")
async def query_knowledge(query: str, top_k: int = 3):
    """Query the knowledge base directly."""
    results = await rag_service.retrieve(query, top_k)
    return APIResponse(data={"results": results, "count": len(results)})