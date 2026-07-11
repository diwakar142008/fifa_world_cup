"""Tests for accessibility service and WCAG compliance."""

import pytest
from app.services.accessibility_service import AccessibilityService


class TestAccessibilityService:
    """Test accessibility features."""

    def test_high_contrast_theme(self):
        """Test high contrast theme generation."""
        theme = AccessibilityService.get_high_contrast_theme()
        assert "name" in theme
        assert "colors" in theme
        assert "primary" in theme["colors"]
        assert theme["name"] == "High Contrast"

    def test_screen_reader_announcement(self):
        """Test screen reader announcement generation."""
        announcement = AccessibilityService.get_screen_reader_announcement(
            "Gate A is now closed", "assertive"
        )
        assert announcement["live_region"] == "aria-live-assertive"
        assert announcement["message"] == "Gate A is now closed"
        assert announcement["atomic"] is True

    def test_keyboard_shortcuts(self):
        """Test keyboard shortcuts documentation."""
        shortcuts = AccessibilityService.get_keyboard_shortcuts()
        assert "Ctrl+K" in shortcuts
        assert "Escape" in shortcuts
        assert len(shortcuts) >= 6

    def test_accessibility_statement(self):
        """Test accessibility statement compliance info."""
        statement = AccessibilityService.get_accessibility_statement()
        assert statement["standard"] == "WCAG 2.2 Level AA"
        assert "contact" in statement
        assert "features" in statement
        assert len(statement["features"]) >= 6

    @pytest.mark.asyncio
    async def test_accessible_route(self):
        """Test accessible route planning."""
        route = await AccessibilityService.get_accessible_route("Gate A")
        assert route["destination"] == "Gate A"
        assert route["accessibility_features"]["wheelchair_accessible"] is True
        assert "estimated_time" in route

    @pytest.mark.asyncio
    async def test_accessible_route_caching(self):
        """Test accessible route caching."""
        route1 = await AccessibilityService.get_accessible_route("Gate B")
        route2 = await AccessibilityService.get_accessible_route("Gate B")
        # Second call should return cached result
        assert route1 == route2
        assert route1["distance"] == "300 meters"