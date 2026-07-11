"""Tests for predictive analytics service."""

import pytest
from app.services.predictive_service import PredictiveService


class TestPredictiveService:
    """Test predictive analytics features."""

    @pytest.mark.asyncio
    async def test_predict_crowd_density(self):
        """Test crowd density prediction."""
        prediction = await PredictiveService.predict_crowd_density("stadium-1", 2)
        assert prediction["stadium_id"] == "stadium-1"
        assert "predicted_density_pct" in prediction
        assert prediction["predicted_density_pct"] >= 0
        assert prediction["predicted_density_pct"] <= 100
        assert "confidence_score" in prediction
        assert "risk_level" in prediction

    @pytest.mark.asyncio
    async def test_predict_congestion_zones(self):
        """Test congestion zone prediction."""
        zones = await PredictiveService.predict_congestion_zones("stadium-1")
        assert "high_risk_zones" in zones
        assert "medium_risk_zones" in zones
        assert len(zones["high_risk_zones"]) >= 2
        assert zones["confidence_score"] >= 0.5

    @pytest.mark.asyncio
    async def test_forecast_departure_patterns(self):
        """Test departure pattern forecasting."""
        forecast = await PredictiveService.forecast_departure_patterns("stadium-1")
        assert "peak_departure_window" in forecast
        assert "estimated_exit_time_minutes" in forecast
        assert forecast["estimated_exit_time_minutes"] > 0
        assert "recommendations" in forecast
        assert len(forecast["recommendations"]) >= 3

    @pytest.mark.asyncio
    async def test_historical_trends(self):
        """Test historical trend analysis."""
        trends = await PredictiveService.get_historical_trends("stadium-1", 30)
        assert trends["period_days"] == 30
        assert "average_attendance" in trends
        assert "incident_trends" in trends
        assert "medical" in trends["incident_trends"]
        assert "recommendations" in trends

    @pytest.mark.asyncio
    async def test_crowd_prediction_caching(self):
        """Test crowd prediction caching."""
        pred1 = await PredictiveService.predict_crowd_density("stadium-2", 1)
        pred2 = await PredictiveService.predict_crowd_density("stadium-2", 1)
        # Second call should return cached result
        assert pred1["predicted_density_pct"] == pred2["predicted_density_pct"]
        assert pred1["confidence_score"] == pred2["confidence_score"]