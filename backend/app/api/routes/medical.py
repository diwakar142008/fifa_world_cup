"""Medical operations API endpoints."""

from fastapi import APIRouter, Depends
from app.schemas.base import APIResponse
from app.mock_data.generator import get_mock_medical_data

router = APIRouter(prefix="/medical", tags=["Medical"])


@router.get("/incidents")
async def get_medical_incidents():
    """Get active medical incidents."""
    data = get_mock_medical_data()
    return APIResponse(data=data.get("incidents", []))


@router.get("/responders")
async def get_responder_teams():
    """Get responder team statuses."""
    data = get_mock_medical_data()
    return APIResponse(data=data.get("responders", []))


@router.get("/equipment")
async def get_equipment_status():
    """Get medical equipment status."""
    data = get_mock_medical_data()
    return APIResponse(data=data.get("equipment", []))
