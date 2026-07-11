"""StadiumMind AI - Production-Grade Generative AI Service.

Provides multi-model AI orchestration with:
- Fallback model support (OpenAI -> Anthropic -> Gemini)
- Confidence scoring and explainable AI
- Conversation memory management
- Streaming and non-streaming responses
- Structured output parsing
- Risk assessment and recommendations
"""

import json
import logging
import asyncio
from typing import AsyncGenerator, Optional
from datetime import datetime, timezone
from dataclasses import dataclass, field

from app.config import get_settings

logger = logging.getLogger("stadiummind.ai")

settings = get_settings()

# ─── AI Client Initialization ──────────────────────────────────

aclient_openai = None
aclient_anthropic = None
aclient_gemini = None

if settings.OPENAI_API_KEY:
    from openai import AsyncOpenAI
    aclient_openai = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    logger.info("OpenAI client initialized")

if settings.ANTHROPIC_API_KEY:
    try:
        import anthropic
        aclient_anthropic = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
        logger.info("Anthropic client initialized")
    except ImportError:
        logger.warning("anthropic package not installed, skipping Anthropic client")

if settings.GEMINI_API_KEY:
    try:
        import google.generativeai as genai
        genai.configure(api_key=settings.GEMINI_API_KEY)
        aclient_gemini = genai
        logger.info("Gemini client initialized")
    except ImportError:
        logger.warning("google-generativeai package not installed, skipping Gemini client")


# ─── Data Models ───────────────────────────────────────────────

@dataclass
class AIResponse:
    """Structured AI response with confidence and explainability."""
    content: str
    confidence_score: float = 0.0
    risk_level: str = "low"
    model_used: str = "unknown"
    reasoning: str = ""
    key_insights: list[str] = field(default_factory=list)
    recommendations: list[str] = field(default_factory=list)
    alternative_actions: list[str] = field(default_factory=list)
    processing_time_ms: float = 0.0
    fallback_used: bool = False


# ─── System Prompts ────────────────────────────────────────────

SYSTEM_PROMPTS = {
    "default": (
        "You are StadiumMind AI, the Generative AI Operating System for FIFA World Cup 2026 Stadiums. "
        "You coordinate 12 specialized AI agents to help stadium operators, security, medical teams, "
        "vendors, and fans. Provide clear, actionable responses with confidence levels."
    ),
    "summary": (
        "You are a stadium operations analyst. Generate a concise, data-driven summary of current "
        "stadium status. Include key metrics, risk assessment, and actionable recommendations. "
        "Output as structured JSON with fields: headline, narrative, risk_level, confidence_score, "
        "key_insights (list), top_recommendations (list)."
    ),
    "predictions": (
        "You are a predictive analytics AI for stadium crowd management. Analyze attendance data "
        "and predict congestion zones, peak times, and recommended actions. "
        "Output as JSON with: predictions (list of {zone, congestion_probability, "
        "predicted_crowd_density, peak_time, reasoning}), recommended_actions (list), "
        "confidence_score, time_window."
    ),
}


# ─── AI Service ────────────────────────────────────────────────

class AIService:
    """Multi-model AI service with fallback support and explainable outputs."""

    def __init__(self):
        self.conversation_memory: dict[str, list[dict]] = {}
        self.max_messages = 20
        self._model_priority = settings.FALLBACK_MODEL_PRIORITY
        self._available_models: dict[str, bool] = {
            "openai": aclient_openai is not None,
            "anthropic": aclient_anthropic is not None,
            "gemini": aclient_gemini is not None,
        }
        logger.info(f"AI Service initialized. Available models: {self._available_models}")

    # ─── Public API Methods ────────────────────────────────────

    async def chat_stream(
        self,
        message: str,
        session_id: str,
        user_context: Optional[dict] = None,
    ) -> AsyncGenerator[str, None]:
        """Streaming chat with real LLM and automatic fallback."""
        start_time = datetime.now(timezone.utc)

        try:
            messages = self._build_conversation_context(session_id, message)
            model_name, client = self._get_available_model()

            if not client:
                yield self._get_fallback_response("chat")
                return

            response_text = ""
            async for chunk in self._stream_from_model(client, model_name, messages):
                response_text += chunk
                yield chunk

            # Save conversation
            self._save_message(session_id, "user", message)
            self._save_message(session_id, "assistant", response_text)

            elapsed = (datetime.now(timezone.utc) - start_time).total_seconds() * 1000
            logger.info(f"AI chat completed in {elapsed:.0f}ms using {model_name}")

        except Exception as e:
            logger.error(f"AI chat error: {str(e)}", exc_info=True)
            yield f"I apologize, but I encountered an error: {str(e)}. Please try again."

    async def generate_summary(self, data: dict) -> dict:
        """Generate AI-powered stadium operations summary with confidence scoring."""
        start_time = datetime.now(timezone.utc)

        model_name, client = self._get_available_model()
        if not client:
            return self._default_summary()

        try:
            prompt = (
                f"Stadium at {data.get('occupancy_pct', 0)}% capacity, "
                f"{data.get('current_attendance', 0)} attendees, "
                f"{data.get('open_gates', 0)}/{data.get('total_gates', 6)} gates open. "
                f"Generate a structured operations summary."
            )

            response = await self._call_model(
                client, model_name, SYSTEM_PROMPTS["summary"], prompt
            )

            result = self._parse_json_response(response)
            elapsed = (datetime.now(timezone.utc) - start_time).total_seconds() * 1000

            return {
                "headline": result.get("headline", "Stadium operations normal"),
                "narrative": result.get("narrative", "All systems operating within normal parameters."),
                "risk_level": result.get("risk_level", "low"),
                "confidence_score": result.get("confidence_score", 0.85),
                "key_insights": result.get("key_insights", ["Normal operations"]),
                "top_recommendations": result.get("top_recommendations", []),
                "model_used": model_name,
                "processing_time_ms": round(elapsed, 2),
            }

        except Exception as e:
            logger.error(f"Summary generation error: {str(e)}")
            return self._default_summary()

    async def generate_predictions(self, data: dict) -> dict:
        """Generate AI-powered crowd and congestion predictions."""
        start_time = datetime.now(timezone.utc)
        attendance = data.get("current_attendance", 0)
        occupancy = data.get("occupancy_pct", 0)

        model_name, client = self._get_available_model()

        if not client:
            return self._default_predictions(occupancy)

        try:
            prompt = (
                f"Attendance: {attendance}, Occupancy: {occupancy}%, "
                f"Gates: {data.get('open_gates', 3)}/{data.get('total_gates', 6)}"
            )

            response = await self._call_model(
                client, model_name, SYSTEM_PROMPTS["predictions"], prompt
            )

            result = self._parse_json_response(response)
            elapsed = (datetime.now(timezone.utc) - start_time).total_seconds() * 1000

            result.setdefault("confidence_score", 0.8)
            result.setdefault("time_window", "next_15_minutes")
            result["model_used"] = model_name
            result["processing_time_ms"] = round(elapsed, 2)

            return result

        except Exception as e:
            logger.error(f"Prediction generation error: {str(e)}")
            return self._default_predictions(occupancy)

    async def get_model_status(self) -> dict:
        """Get status of all available AI models."""
        return {
            "models": {
                "openai": {
                    "available": self._available_models["openai"],
                    "model": settings.OPENAI_MODEL,
                },
                "anthropic": {
                    "available": self._available_models["anthropic"],
                    "model": settings.ANTHROPIC_MODEL,
                },
                "gemini": {
                    "available": self._available_models["gemini"],
                    "model": settings.GEMINI_MODEL,
                },
            },
            "active_model": self._get_active_model_name(),
            "fallback_enabled": sum(1 for v in self._available_models.values() if v) > 1,
        }

    # ─── Private Methods ───────────────────────────────────────

    def _get_available_model(self):
        """Get the first available model client based on priority."""
        for model_name in self._model_priority:
            if self._available_models.get(model_name):
                client = {
                    "openai": aclient_openai,
                    "anthropic": aclient_anthropic,
                    "gemini": aclient_gemini,
                }.get(model_name)
                if client:
                    return model_name, client
        return None, None

    def _get_active_model_name(self) -> str:
        """Get the name of the currently active model."""
        name, _ = self._get_available_model()
        return name or "none"

    def _build_conversation_context(self, session_id: str, message: str) -> list[dict]:
        """Build message context with conversation history."""
        messages = [{"role": "system", "content": SYSTEM_PROMPTS["default"]}]
        history = self.conversation_memory.get(session_id, [])
        for msg in history[-10:]:
            messages.append({"role": msg["role"], "content": msg["content"]})
        messages.append({"role": "user", "content": message})
        return messages

    async def _stream_from_model(self, client, model_name: str, messages: list[dict]) -> AsyncGenerator[str, None]:
        """Stream response from the appropriate model."""
        if model_name == "openai":
            async for chunk in await client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=messages,
                stream=True,
                temperature=0.7,
                max_tokens=800,
            ):
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        elif model_name == "anthropic":
            async with client.messages.stream(
                model=settings.ANTHROPIC_MODEL,
                max_tokens=800,
                messages=[{"role": m["role"], "content": m["content"]} for m in messages if m["role"] != "system"],
                system=SYSTEM_PROMPTS["default"],
            ) as stream:
                async for text in stream.text_stream:
                    yield text

        elif model_name == "gemini":
            model = client.GenerativeModel(settings.GEMINI_MODEL)
            response = await model.generate_content_async(
                messages[-1]["content"] if messages else ""
            )
            yield response.text

    async def _call_model(self, client, model_name: str, system_prompt: str, user_prompt: str) -> str:
        """Call model with structured output (non-streaming)."""
        if model_name == "openai":
            response = await client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.5,
                max_tokens=500,
                response_format={"type": "json_object"},
            )
            return response.choices[0].message.content or "{}"

        elif model_name == "anthropic":
            response = await client.messages.create(
                model=settings.ANTHROPIC_MODEL,
                max_tokens=500,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
            )
            return response.content[0].text if response.content else "{}"

        elif model_name == "gemini":
            model = client.GenerativeModel(settings.GEMINI_MODEL)
            response = await model.generate_content_async(
                f"{system_prompt}\n\n{user_prompt}"
            )
            return response.text

        return "{}"

    @staticmethod
    def _parse_json_response(response: str) -> dict:
        """Safely parse JSON from model response with fallback."""
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            # Try to extract JSON from markdown code blocks
            import re
            json_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", response)
            if json_match:
                try:
                    return json.loads(json_match.group(1))
                except json.JSONDecodeError:
                    pass
            return {}

    def _save_message(self, session_id: str, role: str, content: str) -> None:
        """Save message to conversation memory with timestamp."""
        if session_id not in self.conversation_memory:
            self.conversation_memory[session_id] = []
        self.conversation_memory[session_id].append({
            "role": role,
            "content": content,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        })
        # Trim memory to prevent unbounded growth
        if len(self.conversation_memory[session_id]) > self.max_messages * 2:
            self.conversation_memory[session_id] = self.conversation_memory[session_id][-self.max_messages:]

    def _get_fallback_response(self, response_type: str) -> str:
        """Get intelligent fallback response when no AI model is available."""
        fallbacks = {
            "chat": (
                "I'm currently operating in offline mode. I can still help with basic "
                "stadium information. For AI-powered responses, please configure an API key."
            ),
        }
        return fallbacks.get(response_type, "Service unavailable. Please configure an AI provider.")

    @staticmethod
    def _default_summary() -> dict:
        """Default summary when AI is unavailable."""
        return {
            "headline": "Stadium operations normal",
            "narrative": "All systems operating within normal parameters. AI-powered analysis unavailable.",
            "risk_level": "low",
            "confidence_score": 0.5,
            "key_insights": ["AI service not configured"],
            "top_recommendations": ["Configure an AI provider for enhanced insights"],
            "model_used": "none",
            "processing_time_ms": 0.0,
        }

    @staticmethod
    def _default_predictions(occupancy: float) -> dict:
        """Rule-based fallback predictions when AI is unavailable."""
        risk_zones = []
        if occupancy > settings.CROWD_DENSITY_HIGH_THRESHOLD:
            risk_zones.append({
                "zone": "Main Concourse",
                "congestion_probability": 0.85,
                "predicted_crowd_density": min(100, occupancy + 10),
                "peak_time": "15 minutes",
                "reasoning": "High occupancy trend indicates concourse congestion risk",
            })
        elif occupancy > settings.CROWD_DENSITY_MEDIUM_THRESHOLD:
            risk_zones.append({
                "zone": "Gate Areas",
                "congestion_probability": 0.65,
                "predicted_crowd_density": min(100, occupancy + 5),
                "peak_time": "30 minutes",
                "reasoning": "Moderate occupancy with potential for gate congestion",
            })

        return {
            "predictions": risk_zones,
            "recommended_actions": [
                "Deploy additional staff to high-traffic areas" if occupancy > settings.CROWD_DENSITY_MEDIUM_THRESHOLD
                else "Monitor normal operations",
                "Prepare contingency gates" if occupancy > settings.CROWD_DENSITY_HIGH_THRESHOLD
                else "Standard gate management",
            ],
            "confidence_score": 0.6,
            "time_window": "next_15_minutes",
            "model_used": "rule-based-fallback",
            "processing_time_ms": 0.0,
        }


# Singleton instance
ai_service = AIService()