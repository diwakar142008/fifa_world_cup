"""StadiumMind AI - Real Generative AI Service."""

import os
import asyncio
from typing import AsyncGenerator
from datetime import datetime
from openai import AsyncOpenAI

from app.config import get_settings

settings = get_settings()
aclient = AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

SYSTEM_PROMPT = "You are StadiumMind AI for FIFA World Cup 2026."

class AIService:
    def __init__(self):
        self.conversation_memory: dict[str, list[dict]] = {}
        self.max_messages = 20

    async def chat_stream(self, message: str, session_id: str, user_context: dict) -> AsyncGenerator[str, None]:
        if not aclient:
            yield "AI service not configured. Set OPENAI_API_KEY."
            return

        try:
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]
            history = self.conversation_memory.get(session_id, [])
            for msg in history[-10:]:
                messages.append({"role": msg["role"], "content": msg["content"]})
            messages.append({"role": "user", "content": message})

            response_text = ""
            async for chunk in await aclient.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=messages,
                stream=True,
                temperature=0.7,
                max_tokens=800,
            ):
                if chunk.choices and chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    response_text += content
                    yield content

            self._save_message(session_id, "user", message)
            self._save_message(session_id, "assistant", response_text)

        except Exception as e:
            yield f"Error: {str(e)}"

    async def generate_summary(self, data: dict) -> dict:
        if not aclient:
            return {"headline": "AI unavailable", "narrative": "Configure API key", "risk_level": "unknown", "confidence_score": 0.0, "key_insights": [], "top_recommendations": []}
        try:
            resp = await aclient.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "Generate a one-paragraph stadium operations summary."},
                    {"role": "user", "content": f"Stadium at {data.get('occupancy_pct', 0)}% capacity, {data.get('current_attendance', 0)} attendees."},
                ],
                temperature=0.5,
                max_tokens=300,
            )
            text = resp.choices[0].message.content or "All systems nominal."
            return {"headline": text.split(".")[0], "narrative": text, "risk_level": "low", "confidence_score": 0.9, "key_insights": [text[:100]], "top_recommendations": []}
        except Exception:
            return {"headline": "Status update", "narrative": "Operations normal", "risk_level": "low", "confidence_score": 0.9, "key_insights": [], "top_recommendations": []}

    async def generate_predictions(self, data: dict) -> dict:
        attendance = data.get('current_attendance', 0)
        occupancy = data.get('occupancy_pct', 0)
        
        if not aclient:
            risk_zones = []
            if occupancy > 85:
                risk_zones.append({
                    "zone": "Main Concourse",
                    "congestion_probability": 0.82,
                    "predicted_crowd_density": min(100, occupancy + 10),
                    "peak_time": "15 minutes",
                    "reasoning": "High occupancy trend indicates concourse congestion"
                })
            
            return {
                "predictions": risk_zones,
                "recommended_actions": [
                    "Deploy additional staff to high-traffic areas" if occupancy > 75 else "Monitor normal operations",
                    "Prepare contingency gates" if occupancy > 85 else "Standard gate management"
                ],
                "confidence_score": 0.7,
                "time_window": "next_15_minutes"
            }
        
        try:
            resp = await aclient.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "Predict congestion zones with structured output: predictions (list with zone, congestion_probability, predicted_crowd_density, peak_time, reasoning), recommended_actions (list), confidence_score, time_window."},
                    {"role": "user", "content": f"Attendance: {attendance}, Occupancy: {occupancy}%, Gates: {data.get('open_gates', 3)}/{data.get('total_gates', 6)}"},
                ],
                temperature=0.5,
                max_tokens=350,
                response_format={"type": "json_object"}
            )
            import json
            text = resp.choices[0].message.content or "{}"
            try:
                result = json.loads(text)
                result.setdefault("confidence_score", 0.8)
                result.setdefault("time_window", "next_15_minutes")
                return result
            except json.JSONDecodeError:
                return {
                    "predictions": [{"zone": "General", "prediction": text, "confidence": 0.75}],
                    "recommended_actions": [],
                    "confidence_score": 0.75
                }
        except Exception:
            return {
                "predictions": [],
                "recommended_actions": ["Monitor crowd patterns"],
                "confidence_score": 0.6
            }

    def _save_message(self, session_id: str, role: str, content: str) -> None:
        if session_id not in self.conversation_memory:
            self.conversation_memory[session_id] = []
        self.conversation_memory[session_id].append({
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow().isoformat(),
        })
        if len(self.conversation_memory[session_id]) > self.max_messages * 2:
            self.conversation_memory[session_id] = self.conversation_memory[session_id][-self.max_messages:]

ai_service = AIService()