"""Comprehensive tests for the Predictive Service module.

Tests cover:
- Crowd density prediction with caching
- Congestion zone identification
- Departure pattern forecasting
- Historical trend analysis
- Input validation and edge cases
- Cache integration
"""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from datetime import datetime, timezone

from app.services.predictive_service import PredictiveService


@pytest.fixture
def predictive_service():
    """Create PredictiveService instance."""
    return PredictiveService()


class TestPredictCrowdDensity:
    """Tests for crowd density prediction."""

    @pytest.mark.asyncio
    async def test_predict_crowd_density_basic(self, predictive_service):
        """Test basic crowd density prediction."""
        with patch('app.services.predictive_service.cache') as mock_cache:
            mock_cache.get = AsyncMock(return_value=None)
            mock_cache.set = AsyncMock(return_value=True)

            result = await predictive_service.predict_crowd_density("stadium_1", 2)
            assert result["stadium_id"] == "stadium_1"
            assert "predicted_density_pct" in result
            assert "confidence_score" in result
            assert "risk_level" in result
            assert "recommendation" in result
            assert 0 <= result["predicted_density_pct"] <= 100

    @pytest.mark.asyncio
    async def test_predict_crowd_density_caching(self, predictive_service):
        """Test that predictions are cached."""
        cached_result = {
            "stadium_id": "stadium_1",
            "predicted_density_pct": 80.0,
            "confidence_score": 0.87,
            "risk_level": "medium",
        }
        with patch('app.services.predictive_service.cache') as mock_cache:
            mock_cache.get = AsyncMock(return_value=cached_result)

            result = await predictive_service.predict_crowd_density("stadium_1", 2)
            assert result == cached_result
            mock_cache.set.assert_not_called()

    @pytest.mark.asyncio
    async def test_predict_crowd_density_high_risk(self, predictive_service):
        """Test high risk detection for high density."""
        with patch('app.services.predictive_service.cache') as mock_cache:
            mock_cache.get = AsyncMock(return_value=None)
            mock_cache.set = AsyncMock(return_value=True)

            result = await predictive_service.predict_crowd_density("stadium_1", 5)
            assert result["risk_level"] in ["high", "medium", "low"]

    @pytest.mark.asyncio
    async def test_predict_crowd_density_negative_hours(self, predictive_service):
        """Test handling of negative hours_ahead."""
        with patch('app.services.predictive_service.cache') as mock_cache:
            mock_cache.get = AsyncMock(return_value=None)
            mock_cache.set = AsyncMock(return_value=True)

            result = await predictive_service.predict_crowd_density("stadium_1", -1)
            assert result is not None
            assert "predicted_density_pct" in result

    @pytest.mark.asyncio
    async def test_predict_crowd_density_excessive_hours(self, predictive_service):
        """Test handling of hours_ahead > 48."""
        with patch('app.services.predictive_service.cache') as mock_cache:
            mock_cache.get = AsyncMock(return_value=None)
            mock_cache.set = AsyncMock(return_value=True)

            result = await predictive_service.predict_crowd_density("stadium_1", 100)
            assert result is not None

    @pytest.mark.asyncio
    async def test_predict_crowd_density_different_stadiums(self, predictive_service):
        """Test predictions for different stadiums are independent."""
        with patch('app.services.predictive_service.cache') as mock_cache:
            mock_cache.get = AsyncMock(return_value=None)
            mock_cache.set = AsyncMock(return_value=True)

            result1 = await predictive_service.predict_crowd_density("stadium_a", 1)
            result2 = await predictive_service.predict_crowd_density("stadium_b", 1)
            assert result1["stadium_id"] == "stadium_a"
            assert result2["stadium_id"] == "stadium_b"

    @pytest.mark.asyncio
    async def test_predict_crowd_density_includes_factors(self, predictive_service):
        """Test prediction includes contributing factors."""
        with patch('app.services.predictive_service.cache') as mock_cache:
            mock_cache.get = AsyncMock(return_value=None)
            mock_cache.set = AsyncMock(return_value=True)

            result = await predictive_service.predict_crowd_density("stadium_1", 2)
            assert len(result["factors"]) >= 3
            assert "Historical match attendance patterns" in result["factors"]


class TestPredictCongestionZones:
    """Tests for congestion zone prediction."""

    @pytest.mark.asyncio
    async def test_predict_congestion_zones_basic(self, predictive_service):
        """Test basic congestion zone prediction."""
        result = await predictive_service.predict_congestion_zones("stadium_1")
        assert result["stadium_id"] == "stadium_1"
        assert "high_risk_zones" in result
        assert "medium_risk_zones" in result
        assert "confidence_score" in result

    @pytest.mark.asyncio
    async def test_predict_congestion_zones_high_risk(self, predictive_service):
        """Test high risk zones have correct structure."""
        result = await predictive_service.predict_congestion_zones("stadium_1")
        for zone in result["high_risk_zones"]:
            assert "zone" in zone
            assert "congestion_probability" in zone
            assert "peak_time" in zone
            assert "reasoning" in zone
            assert 0 <= zone["congestion_probability"] <= 1

    @pytest.mark.asyncio
    async def test_predict_congestion_zones_medium_risk(self, predictive_service):
        """Test medium risk zones have correct structure."""
        result = await predictive_service.predict_congestion_zones("stadium_1")
        for zone in result["medium_risk_zones"]:
            assert "zone" in zone
            assert "congestion_probability" in zone
            assert "peak_time" in zone
            assert "reasoning" in zone

    @pytest.mark.asyncio
    async def test_predict_congestion_zones_confidence(self, predictive_service):
        """Test confidence score is within valid range."""
        result = await predictive_service.predict_congestion_zones("stadium_1")
        assert 0 <= result["confidence_score"] <= 1

    @pytest.mark.asyncio
    async def test_predict_congestion_zones_model_version(self, predictive_service):
        """Test model version is included."""
        result = await predictive_service.predict_congestion_zones("stadium_1")
        assert "model_version" in result
        assert result["model_version"] == "v2.1.0"


class TestForecastDeparturePatterns:
    """Tests for departure pattern forecasting."""

    @pytest.mark.asyncio
    async def test_forecast_departure_patterns_basic(self, predictive_service):
        """Test basic departure pattern forecast."""
        result = await predictive_service.forecast_departure_patterns("stadium_1")
        assert result["stadium_id"] == "stadium_1"
        assert "peak_departure_window" in result
        assert "estimated_exit_time_minutes" in result
        assert "metro_demand_multiplier" in result

    @pytest.mark.asyncio
    async def test_forecast_departure_patterns_recommendations(self, predictive_service):
        """Test departure forecast includes recommendations."""
        result = await predictive_service.forecast_departure_patterns("stadium_1")
        assert len(result["recommendations"]) >= 3
        assert all(isinstance(r, str) for r in result["recommendations"])

    @pytest.mark.asyncio
    async def test_forecast_departure_patterns_confidence(self, predictive_service):
        """Test confidence score is within valid range."""
        result = await predictive_service.forecast_departure_patterns("stadium_1")
        assert 0 <= result["confidence_score"] <= 1

    @pytest.mark.asyncio
    async def test_forecast_departure_patterns_positive_times(self, predictive_service):
        """Test estimated times are positive."""
        result = await predictive_service.forecast_departure_patterns("stadium_1")
        assert result["estimated_exit_time_minutes"] > 0
        assert result["parking_clearance_time_minutes"] > 0
        assert result["metro_demand_multiplier"] > 0


class TestHistoricalTrends:
    """Tests for historical trend analysis."""

    @pytest.mark.asyncio
    async def test_get_historical_trends_basic(self, predictive_service):
        """Test basic historical trend retrieval."""
        result = await predictive_service.get_historical_trends("stadium_1", 30)
        assert result["stadium_id"] == "stadium_1"
        assert result["period_days"] == 30
        assert "average_attendance" in result
        assert "peak_attendance" in result

    @pytest.mark.asyncio
    async def test_get_historical_trends_incident_types(self, predictive_service):
        """Test incident trends include all expected types."""
        result = await predictive_service.get_historical_trends("stadium_1", 30)
        incident_types = ["medical", "crowd_density", "vendor_issues", "security_incidents"]
        for incident_type in incident_types:
            assert incident_type in result["incident_trends"]
            assert "count" in result["incident_trends"][incident_type]
            assert "trend" in result["incident_trends"][incident_type]

    @pytest.mark.asyncio
    async def test_get_historical_trends_days_clamping(self, predictive_service):
        """Test days parameter is clamped to valid range."""
        result = await predictive_service.get_historical_trends("stadium_1", 0)
        assert result["period_days"] == 1

        result = await predictive_service.get_historical_trends("stadium_1", 500)
        assert result["period_days"] == 365

    @pytest.mark.asyncio
    async def test_get_historical_trends_recommendations(self, predictive_service):
        """Test historical trends include recommendations."""
        result = await predictive_service.get_historical_trends("stadium_1", 30)
        assert len(result["recommendations"]) >= 2

    @pytest.mark.asyncio
    async def test_get_historical_trends_attendance_values(self, predictive_service):
        """Test attendance values are reasonable."""
        result = await predictive_service.get_historical_trends("stadium_1", 30)
        assert result["average_attendance"] > 0
        assert result["peak_attendance"] >= result["average_attendance"]


class TestPredictiveServiceEdgeCases:
    """Test edge cases for predictive service."""

    @pytest.mark.asyncio
    async def test_empty_stadium_id(self, predictive_service):
        """Test with empty stadium ID."""
        with patch('app.services.predictive_service.cache') as mock_cache:
            mock_cache.get = AsyncMock(return_value=None)
            mock_cache.set = AsyncMock(return_value=True)

            result = await predictive_service.predict_crowd_density("", 2)
            assert result["stadium_id"] == ""

    @pytest.mark.asyncio
    async def test_special_characters_stadium_id(self, predictive_service):
        """Test with special characters in stadium ID."""
        with patch('app.services.predictive_service.cache') as mock_cache:
            mock_cache.get = AsyncMock(return_value=None)
            mock_cache.set = AsyncMock(return_value=True)

            result = await predictive_service.predict_crowd_density("stad!um@#$", 2)
            assert result is not None

    @pytest.mark.asyncio
    async def test_cache_set_failure(self, predictive_service):
        """Test behavior when cache set fails."""
        with patch('app.services.predictive_service.cache') as mock_cache:
            mock_cache.get = AsyncMock(return_value=None)
            mock_cache.set = AsyncMock(side_effect=Exception("Cache error"))

            result = await predictive_service.predict_crowd_density("stadium_1", 2)
            assert result is not None  # Should still return result even if cache fails