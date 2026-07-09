"""Transportation API endpoints for transit, parking, and traffic."""

from fastapi import APIRouter
from app.schemas.base import APIResponse
from app.mock_data.generator import get_mock_transport_data

router = APIRouter(prefix="/transport", tags=["Transport"])


@router.get("/transit")
async def get_transit_lines():
    """Get real-time transit line status."""
    data = get_mock_transport_data()
    return APIResponse(data=data.get("transit", []))


@router.get("/parking")
async def get_parking_status():
    """Get parking lot occupancy."""
    data = get_mock_transport_data()
    return APIResponse(data=data.get("parking", []))


@router.get("/traffic")
async def get_traffic_predictions():
    """Get post-match traffic predictions."""
    data = get_mock_transport_data()
    return APIResponse(data=data.get("traffic", []))
