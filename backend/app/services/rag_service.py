"""StadiumMind AI - Retrieval-Augmented Generation Service."""

import json
import random
from datetime import datetime
from typing import Optional

from app.config import get_settings

settings = get_settings()

# In-memory knowledge base (replaces vector DB for deployment readiness)
# In production, replace with Pinecone/Weaviate/Qdrant
KNOWLEDGE_BASE = [
    {"id": "kb-001", "source": "Stadium Info", "content": "MetLife Stadium is located in East Rutherford, New Jersey. Capacity: 75,000. Home to FIFA World Cup 2026 matches including Quarter-Final: BRA v ARG.", "tags": ["stadium", "location", "capacity"]},
    {"id": "kb-002", "source": "Stadium Info", "content": "Gates: Gate A (Main Entrance) open, Gate B (East Entrance) open, Gate C (South Entrance) busy, Gate D (West Entrance) open. Gates open 2 hours before kickoff.", "tags": ["gates", "entrance", "access"]},
    {"id": "kb-003", "source": "Emergency", "content": "Emergency procedures: In case of evacuation, follow marshals to nearest exit. 12 evacuation routes available. Assembly points in north and south parking lots.", "tags": ["emergency", "evacuation", "safety"]},
    {"id": "kb-004", "source": "Emergency", "content": "Medical stations: Main medical station near Section 100, Upper medical station near Section 300. AED defibrillators available at 24 locations.", "tags": ["medical", "emergency", "health"]},
    {"id": "kb-005", "source": "Transportation", "content": "Metro: Line 1 (Red) on-time, Line 2 (Blue) operational, Line 3 (Green) on-time. Shuttle buses run continuously from parking lots.", "tags": ["transit", "metro", "shuttle"]},
    {"id": "kb-006", "source": "Transportation", "content": "Parking: Lot A (North) busy, Lot B (East) moderate, Lot C (South) available, VIP parking available. Total 12,500 spaces.", "tags": ["parking", "transportation"]},
    {"id": "kb-007", "source": "Accessibility", "content": "Wheelchair accessible routes available throughout stadium. Elevators at all main concourses. Accessibility assistants available at information desks.", "tags": ["accessibility", "wheelchair", "ADA"]},
    {"id": "kb-008", "source": "Volunteer", "content": "Volunteers wear blue uniforms. 156 personnel on duty. Information desks at Gates A, B, C, D and main concourse.", "tags": ["volunteer", "staff", "help"]},
    {"id": "kb-009", "source": "Vendor", "content": "Food courts: Court 1 (North) open, Court 2 (East) open, Court 3 (South) busy. Top items: Hot Dogs, Burgers, Bottled Water. Peak hours: 6-8 PM.", "tags": ["food", "vendor", "concession"]},
    {"id": "kb-010", "source": "FAQ", "content": "Languages supported: English, Spanish, French, German, Italian, Portuguese, Arabic, Mandarin, Japanese, Korean, Hindi.", "tags": ["language", "translation", "multilingual"]},
    {"id": "kb-011", "source": "Security", "content": "Security personnel: 28 on duty. 64 cameras online. No-fly zone enforced. Bag checks at all gates. Prohibited items list available at gates.", "tags": ["security", "safety", "cameras"]},
    {"id": "kb-012", "source": "Weather", "content": "Weather policy: In case of lightning, evacuation to covered concourses. Rain ponchos available at gates. Temperature monitoring throughout stadium.", "tags": ["weather", "rain", "safety"]},
]

class RAGService:
    def __init__(self):
        self.knowledge_base = KNOWLEDGE_BASE

    async def retrieve(self, query: str, top_k: int = 3) -> list[dict]:
        """Retrieve relevant knowledge based on query."""
        query_lower = query.lower()
        scored = []

        for doc in self.knowledge_base:
            score = 0
            content_lower = doc["content"].lower()
            tags_lower = [t.lower() for t in doc.get("tags", [])]

            # Tag matching
            for tag in tags_lower:
                if tag in query_lower:
                    score += 0.4

            # Content keyword matching
            words = query_lower.split()
            for word in words:
                if word in content_lower:
                    score += 0.3

            # Source matching
            source_lower = doc["source"].lower()
            if source_lower in query_lower:
                score += 0.2

            scored.append((score, doc))

        scored.sort(key=lambda x: x[0], reverse=True)
        return [doc for score, doc in scored[:top_k] if score > 0]

    async def add_document(self, content: str, source: str, tags: list[str]) -> dict:
        """Add a document to knowledge base."""
        doc = {
            "id": f"kb-{len(self.knowledge_base) + 1:03d}",
            "source": source,
            "content": content,
            "tags": tags,
        }
        self.knowledge_base.append(doc)
        return doc

    async def get_stats(self) -> dict:
        """Get knowledge base statistics."""
        return {
            "total_documents": len(self.knowledge_base),
            "sources": list(set(d["source"] for d in self.knowledge_base)),
        }

rag_service = RAGService()