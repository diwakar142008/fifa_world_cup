"""Tests for simulation engine."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestSimulationEngine:
    """Test simulation scenarios and impact analysis."""

    def test_gate_closure_scenario(self):
        """Test gate closure simulation."""
        response = client.post(
            "/api/v1/simulation/run",
            json={"query": "What happens if Gate A closes?"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert data["data"]["scenario"] == "Gate Closure"
        assert "impacts" in data["data"]
        assert len(data["data"]["recommended_actions"]) > 0

    def test_rain_scenario(self):
        """Test weather simulation."""
        response = client.post(
            "/api/v1/simulation/run",
            json={"query": "What happens if it starts raining?"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["scenario"] == "Heavy Rain"
        assert data["data"]["risk_level"] in ["moderate", "high"]

    def test_metro_delay_scenario(self):
        """Test metro delay simulation."""
        response = client.post(
            "/api/v1/simulation/run",
            json={"query": "What happens if Metro Line 2 stops?"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["scenario"] == "Metro Line Delay"

    def test_evacuation_scenario(self):
        """Test evacuation simulation."""
        response = client.post(
            "/api/v1/simulation/run",
            json={"query": "Simulate evacuation of upper bowl"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["risk_level"] == "critical"
        assert data["data"]["confidence_score"] >= 0.8

    def test_crowd_surge_scenario(self):
        """Test crowd surge simulation."""
        response = client.post(
            "/api/v1/simulation/run",
            json={"query": "massive stampede in the stands"},
        )
        assert response.status_code == 200
        data = response.json()
        # "stampede" should match crowd surge detector
        assert data["data"]["scenario"] == "Crowd Surge"

    def test_custom_scenario(self):
        """Test custom/unknown scenario handling."""
        response = client.post(
            "/api/v1/simulation/run",
            json={"query": "Analyze custom scenario xyz123"},
        )
        assert response.status_code == 200
        data = response.json()
        assert "data" in data
        assert "impacts" in data["data"]

    def test_simulation_with_scenario_type(self):
        """Test simulation with explicit scenario type."""
        response = client.post(
            "/api/v1/simulation/run",
            json={"query": "Test", "scenario_type": "power_failure"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["data"]["scenario"] == "Power Failure"

    def test_simulation_impact_structure(self):
        """Test that impacts have correct structure."""
        response = client.post(
            "/api/v1/simulation/run",
            json={"query": "What if Gate A closes?"},
        )
        data = response.json()["data"]
        impacts = data["impacts"]

        # Check required impact categories
        assert "queue_times" in impacts
        assert "walking_times" in impacts
        assert "safety" in impacts
        assert "transport" in impacts
        assert "revenue" in impacts
        assert "crowd_flow" in impacts

        # Check impact metrics structure
        for category, metrics in impacts.items():
            if metrics:
                metric = metrics[0]
                assert "metric" in metric
                assert "before" in metric
                assert "after" in metric
                assert "impact" in metric
                assert "delta_pct" in metric

    def test_simulation_recommendations(self):
        """Test that recommendations are provided."""
        response = client.post(
            "/api/v1/simulation/run",
            json={"query": "Gate closure emergency"},
        )
        data = response.json()["data"]
        assert len(data["recommended_actions"]) > 0
        assert len(data["alternatives"]) > 0
        assert len(data["expected_outcome"]) > 0

    def test_simulation_whitespace_query(self):
        """Test simulation with whitespace-only query."""
        response = client.post(
            "/api/v1/simulation/run",
            json={"query": "   "},
        )
        # Whitespace should be trimmed and treated as custom scenario
        assert response.status_code == 200
