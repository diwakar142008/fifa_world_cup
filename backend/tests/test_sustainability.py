"""Tests for sustainability and environmental monitoring."""

import pytest
from app.services.sustainability_service import SustainabilityService


class TestSustainabilityService:
    """Test sustainability metrics and monitoring."""

    @pytest.mark.asyncio
    async def test_carbon_footprint(self):
        """Test carbon footprint metrics."""
        metrics = await SustainabilityService.get_carbon_footprint()
        assert "total_co2_tons" in metrics
        assert "energy_consumption_kwh" in metrics
        assert "renewable_energy_pct" in metrics
        assert metrics["renewable_energy_pct"] >= 0
        assert metrics["renewable_energy_pct"] <= 100

    @pytest.mark.asyncio
    async def test_energy_metrics(self):
        """Test energy consumption metrics."""
        energy = await SustainabilityService.get_energy_metrics()
        assert "current_consumption_kw" in energy
        assert "solar_generation_kw" in energy
        assert energy["efficiency_score"] >= 0
        assert energy["efficiency_score"] <= 100

    @pytest.mark.asyncio
    async def test_waste_metrics(self):
        """Test waste management metrics."""
        waste = await SustainabilityService.get_waste_metrics()
        assert "total_waste_kg" in waste
        assert "recycled_kg" in waste
        assert waste["recycling_rate_pct"] >= 0
        assert waste["recycling_rate_pct"] <= 100

    @pytest.mark.asyncio
    async def test_water_metrics(self):
        """Test water consumption metrics."""
        water = await SustainabilityService.get_water_metrics()
        assert "total_usage_liters" in water
        assert "recycled_water_pct" in water
        assert water["fixture_efficiency_score"] >= 0

    @pytest.mark.asyncio
    async def test_sustainability_score(self):
        """Test overall sustainability score calculation."""
        score = await SustainabilityService.get_sustainability_score()
        assert "overall_score" in score
        assert "grade" in score
        assert score["grade"] in ["A", "B", "C", "D", "F"]
        assert "recommendations" in score
        assert len(score["recommendations"]) >= 3

    @pytest.mark.asyncio
    async def test_carbon_footprint_caching(self):
        """Test carbon footprint data caching."""
        metrics1 = await SustainabilityService.get_carbon_footprint()
        metrics2 = await SustainabilityService.get_carbon_footprint()
        # Should return cached data (same values except timestamp)
        assert metrics1["total_co2_tons"] == metrics2["total_co2_tons"]
        assert metrics1["renewable_energy_pct"] == metrics2["renewable_energy_pct"]
