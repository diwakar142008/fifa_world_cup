"""Multilingual Translation Service for Global Fan Support."""

from typing import Optional
from app.services.cache_service import cache


class MultilingualService:
    """Provides real-time translation for multiple languages."""

    SUPPORTED_LANGUAGES = {
        "en": "English",
        "es": "Spanish",
        "fr": "French",
        "de": "German",
        "pt": "Portuguese",
        "ar": "Arabic",
        "zh": "Chinese",
        "ja": "Japanese",
        "ko": "Korean",
        "hi": "Hindi",
        "it": "Italian",
        "nl": "Dutch",
        "ru": "Russian",
        "sv": "Swedish",
        "tr": "Turkish",
    }

    # Stadium-specific translations
    STADIUM_TERMS = {
        "gate": {"en": "Gate", "es": "Puerta", "fr": "Porte", "de": "Tor", "pt": "Portão", "ar": "باب", "zh": "门", "ja": "ゲート", "hi": "द्वार"},
        "exit": {"en": "Exit", "es": "Salida", "fr": "Sortie", "de": "Ausgang", "pt": "Saída", "ar": "مخرج", "zh": "出口", "ja": "出口", "hi": "निकास"},
        "restroom": {"en": "Restroom", "es": "Baño", "fr": "Toilettes", "de": "Toilette", "pt": "Banheiro", "ar": "دورات مياه", "zh": "洗手间", "ja": "トイレ", "hi": "टॉयलेट"},
        "emergency": {"en": "Emergency", "es": "Emergencia", "fr": "Urgence", "de": "Notfall", "pt": "Emergência", "ar": "طوارئ", "zh": "紧急情况", "ja": "緊急", "hi": "आपातकाल"},
        "medical": {"en": "Medical", "es": "Médico", "fr": "Médical", "de": "Medizinisch", "pt": "Médico", "ar": "طبي", "zh": "医疗", "ja": "医療", "hi": "चिकित्सा"},
        "food": {"en": "Food", "es": "Comida", "fr": "Nourriture", "de": "Essen", "pt": "Comida", "ar": "طعام", "zh": "食物", "ja": "食べ物", "hi": "खाना"},
    }

    @staticmethod
    def get_supported_languages() -> dict[str, str]:
        """Get list of supported languages."""
        return MultilingualService.SUPPORTED_LANGUAGES.copy()

    @staticmethod
    def translate(text: str, target_lang: str) -> str:
        """Translate text to target language."""
        if target_lang not in MultilingualService.SUPPORTED_LANGUAGES:
            target_lang = "en"
        
        # Check if it's a stadium term
        text_lower = text.lower()
        for term, translations in MultilingualService.STADIUM_TERMS.items():
            if text_lower == term:
                return translations.get(target_lang, text)
        
        # In production, use real translation API (Google Translate, DeepL, etc.)
        # For now, return original with language indicator
        return f"[{target_lang.upper()}] {text}"

    @staticmethod
    def detect_language(text: str) -> str:
        """Detect language from text."""
        # Simple detection based on character ranges
        if any('\u4e00' <= c <= '\u9fff' for c in text):
            return "zh"
        elif any('\u3040' <= c <= '\u309f' for c in text) or any('\u30a0' <= c <= '\u30ff' for c in text):
            return "ja"
        elif any('\u0600' <= c <= '\u06ff' for c in text):
            return "ar"
        elif any('\u0900' <= c <= '\u097f' for c in text):
            return "hi"
        elif any('\uac00' <= c <= '\ud7af' for c in text):
            return "ko"
        elif any('\u0400' <= c <= '\u04ff' for c in text):
            return "ru"
        else:
            return "en"

    @staticmethod
    def get_localized_announcement(message: str, lang: str = "en") -> dict:
        """Get localized announcement for stadium."""
        return {
            "original": message,
            "translated": MultilingualService.translate(message, lang),
            "language": lang,
            "language_name": MultilingualService.SUPPORTED_LANGUAGES.get(lang, "English"),
        }