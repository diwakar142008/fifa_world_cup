"""StadiumMind AI - WebSocket Manager for Real-Time Updates.

Manages WebSocket connections for live stadium data streaming.
Broadcasts events to connected clients (dashboard, map, alerts).
"""

import json
import asyncio
from typing import Set, Any
from fastapi import WebSocket, WebSocketDisconnect
from datetime import datetime


class ConnectionManager:
    """Manages WebSocket connections and broadcasts."""

    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.connection_rooms: dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room: str = "global") -> None:
        """Accept and register a new WebSocket connection."""
        await websocket.accept()
        self.active_connections.add(websocket)
        if room not in self.connection_rooms:
            self.connection_rooms[room] = set()
        self.connection_rooms[room].add(websocket)
        await self.send_personal(websocket, {
            "type": "connection_established",
            "message": "Connected to StadiumMind AI real-time feed",
            "room": room,
            "timestamp": datetime.utcnow().isoformat(),
        })

    def disconnect(self, websocket: WebSocket, room: str = "global") -> None:
        """Remove a disconnected WebSocket."""
        self.active_connections.discard(websocket)
        if room in self.connection_rooms:
            self.connection_rooms[room].discard(websocket)

    async def send_personal(self, websocket: WebSocket, data: dict) -> None:
        """Send a message to a specific WebSocket."""
        try:
            await websocket.send_json(data)
        except Exception:
            self.disconnect(websocket)

    async def broadcast(self, data: dict, room: str = "global") -> None:
        """Broadcast a message to all connected clients in a room."""
        if room in self.connection_rooms:
            dead_connections = set()
            for websocket in self.connection_rooms[room]:
                try:
                    await websocket.send_json(data)
                except Exception:
                    dead_connections.add(websocket)
            for dead in dead_connections:
                self.disconnect(dead, room)

    async def broadcast_all(self, data: dict) -> None:
        """Broadcast to ALL connected clients."""
        dead_connections = set()
        for websocket in self.active_connections:
            try:
                await websocket.send_json(data)
            except Exception:
                dead_connections.add(websocket)
        for dead in dead_connections:
            self.active_connections.discard(dead)

    async def broadcast_event(self, event_type: str, payload: dict) -> None:
        """Broadcast a structured event to all clients."""
        await self.broadcast_all({
            "type": event_type,
            "payload": payload,
            "timestamp": datetime.utcnow().isoformat(),
        })

    async def broadcast_stadium_update(self, data: dict) -> None:
        """Broadcast stadium data update."""
        await self.broadcast_event("stadium_update", data)

    async def broadcast_incident_alert(self, incident: dict) -> None:
        """Broadcast an incident alert."""
        await self.broadcast_event("incident_alert", incident)

    async def broadcast_crowd_alert(self, alert: dict) -> None:
        """Broadcast crowd density alert."""
        await self.broadcast_event("crowd_alert", alert)

    def get_connection_count(self) -> int:
        """Get the number of active connections."""
        return len(self.active_connections)

    def get_rooms(self) -> dict[str, int]:
        """Get room connection counts."""
        return {room: len(conns) for room, conns in self.connection_rooms.items()}


# Global WebSocket manager instance
manager = ConnectionManager()


async def broadcast_periodic_updates():
    """Periodically broadcast stadium data updates to all clients."""
    while True:
        try:
            from app.mock_data.generator import get_mock_stadium_data
            data = get_mock_stadium_data()
            await manager.broadcast_stadium_update({
                "attendance": data["current_attendance"],
                "occupancy_pct": data["occupancy_pct"],
                "active_incidents": len([i for i in data.get("incidents", []) if i["status"] == "active"]),
                "zones": data.get("zones", []),
                "timestamp": datetime.utcnow().isoformat(),
            })
        except Exception:
            pass
        await asyncio.sleep(5)  # Update every 5 seconds