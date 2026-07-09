"""Stadium, crowd, zone, and POI API endpoints."""

import asyncio
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.base import APIResponse
from app.schemas.stadium import StadiumResponse, ZoneResponse, POIResponse, CrowdDataResponse, IncidentResponse
from app.models.stadium import Stadium, Zone, POI
from app.models.crowd import CrowdData
from app.models.incidents import Incident
from app.mock_data.generator import get_mock_stadium_data
from app.config import get_settings

router = APIRouter(prefix="/stadium", tags=["Stadium"])


@router.get("/", response_model=APIResponse[StadiumResponse])
async def get_stadium_status(db: AsyncSession = Depends(get_db)):
    """Get current stadium status with attendance and weather."""
    settings = get_settings()
    if settings.USE_MOCK_DATA:
        data = get_mock_stadium_data()
        return APIResponse(data=data)
    # Real DB query
    stadium = await db.get(Stadium, 1)
    if not stadium:
        raise HTTPException(404, "Stadium not found")
    return APIResponse(data=StadiumResponse.model_validate(stadium))


@router.get("/zones", response_model=APIResponse[list[ZoneResponse]])
async def get_zones(db: AsyncSession = Depends(get_db)):
    """Get all stadium zones with current crowd levels."""
    settings = get_settings()
    if settings.USE_MOCK_DATA:
        data = get_mock_stadium_data()
        return APIResponse(data=data.get("zones", []))
    # TODO: Real DB query
    return APIResponse(data=[])


@router.get("/pois", response_model=APIResponse[list[POIResponse]])
async def get_points_of_interest(db: AsyncSession = Depends(get_db)):
    """Get all points of interest within the stadium."""
    settings = get_settings()
    if settings.USE_MOCK_DATA:
        data = get_mock_stadium_data()
        return APIResponse(data=data.get("pois", []))
    return APIResponse(data=[])


@router.get("/crowd", response_model=APIResponse[list[CrowdDataResponse]])
async def get_crowd_data(db: AsyncSession = Depends(get_db)):
    """Get real-time crowd data across all zones."""
    settings = get_settings()
    if settings.USE_MOCK_DATA:
        data = get_mock_stadium_data()
        return APIResponse(data=data.get("crowd_data", []))
    return APIResponse(data=[])


@router.get("/incidents", response_model=APIResponse[list[IncidentResponse]])
async def get_incidents(status: str | None = None, db: AsyncSession = Depends(get_db)):
    """Get active incidents, optionally filtered by status."""
    settings = get_settings()
    if settings.USE_MOCK_DATA:
        data = get_mock_stadium_data()
        incidents = data.get("incidents", [])
        if status:
            incidents = [i for i in incidents if i.get("status") == status]
        return APIResponse(data=incidents)
    return APIResponse(data=[])


@router.websocket("/ws/crowd")
async def crowd_websocket(websocket: WebSocket):
    """WebSocket endpoint for real-time crowd data updates."""
    await websocket.accept()
    settings = get_settings()
    try:
        while True:
            data = get_mock_stadium_data()
            await websocket.send_json({
                "type": "crowd_update",
                "data": data.get("crowd_data", []),
                "timestamp": data.get("timestamp"),
            })
            await asyncio.sleep(settings.MOCK_UPDATE_INTERVAL_SECONDS)
    except WebSocketDisconnect:
        pass


@router.websocket("/ws/incidents")
async def incidents_websocket(websocket: WebSocket):
    """WebSocket endpoint for real-time incident updates."""
    await websocket.accept()
    settings = get_settings()
    try:
        while True:
            data = get_mock_stadium_data()
            await websocket.send_json({
                "type": "incident_update",
                "data": data.get("incidents", []),
                "timestamp": data.get("timestamp"),
            })
            await asyncio.sleep(settings.MOCK_UPDATE_INTERVAL_SECONDS * 2)
    except WebSocketDisconnect:
        pass
