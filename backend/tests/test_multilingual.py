"""Tests for multilingual translation service."""

import pytest
from app.services.multilingual_service import MultilingualService


class TestMultilingualService:
    """Test multilingual features."""

    def test_supported_languages(self):
        """Test supported languages list."""
        languages = MultilingualService.get_supported_languages()
        assert "en" in languages
        assert "es" in languages
        assert "ar" in languages
        assert "zh" in languages
        assert len(languages) >= 10

    def test_translate_stadium_term(self):
        """Test stadium term translation."""
        result = MultilingualService.translate("gate", "es")
        assert result == "Puerta"
        assert "Puerta" in result

    def test_translate_fallback(self):
        """Test translation fallback for unsupported language."""
        result = MultilingualService.translate("exit", "xx")
        assert "[XX]" in result or "Exit" in result

    def test_detect_language_english(self):
        """Test English language detection."""
        lang = MultilingualService.detect_language("Welcome to the stadium")
        assert lang == "en"

    def test_detect_language_arabic(self):
        """Test Arabic language detection."""
        lang = MultilingualService.detect_language("مرحباً بكم في الملعب")
        assert lang == "ar"

    def test_detect_language_chinese(self):
        """Test Chinese language detection."""
        lang = MultilingualService.detect_language("欢迎来到体育场")
        assert lang == "zh"

    def test_localized_announcement(self):
        """Test localized announcement generation."""
        announcement = MultilingualService.get_localized_announcement(
            "Emergency evacuation in progress", "fr"
        )
        assert announcement["language"] == "fr"
        assert announcement["language_name"] == "French"
        assert "original" in announcement