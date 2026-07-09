"""Vendor operations API endpoints."""

from fastapi import APIRouter
from app.schemas.base import APIResponse
from app.mock_data.generator import get_mock_vendor_data

router = APIRouter(prefix="/vendor", tags=["Vendor"])


@router.get("/inventory")
async def get_inventory():
    """Get current inventory levels with demand forecasts."""
    data = get_mock_vendor_data()
    return APIResponse(data=data.get("inventory", []))


@router.get("/peak-hours")
async def get_peak_hours():
    """Get peak hour predictions for all vendors."""
    data = get_mock_vendor_data()
    return APIResponse(data=data.get("peak_hours", []))


@router.get("/demand-alerts")
async def get_demand_alerts():
    """Get demand prediction alerts."""
    data = get_mock_vendor_data()
    return APIResponse(data=data.get("alerts", []))
