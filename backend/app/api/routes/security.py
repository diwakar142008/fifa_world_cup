"""Security monitoring API endpoints."""

from fastapi import APIRouter, Depends
from app.schemas.base import APIResponse
from app.mock_data.generator import get_mock_security_data

router = APIRouter(prefix="/security", tags=["Security"])


@router.get("/zones")
async def get_security_zones():
    """Get zone security status."""
    data = get_mock_security_data()
    return APIResponse(data=data.get("zones", []))


@router.get("/alerts")
async def get_security_alerts():
    """Get active security alerts."""
    data = get_mock_security_data()
    return APIResponse(data=data.get("alerts", []))


@router.get("/personnel")
async def get_personnel_status():
    """Get security personnel deployment status."""
    data = get_mock_security_data()
    return APIResponse(data=data.get("personnel", []))
