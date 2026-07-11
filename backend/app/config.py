"""StadiumMind AI — Application Configuration.

Centralized settings loaded from environment variables with sensible defaults
for development, testing, and production environments.
Uses Pydantic BaseSettings for validation and type coercion.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    # ─── Application ───────────────────────────────────────────
    APP_NAME: str = "StadiumMind AI"
    APP_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    DEBUG: bool = False
    TESTING: bool = False  # Set via environment, NOT hardcoded

    # ─── Server ────────────────────────────────────────────────
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 4
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://stadium-mind.ai",
    ]

    # ─── Database ──────────────────────────────────────────────
    DATABASE_URL: str = "postgresql+asyncpg://user:pass@localhost:5432/stadiummind"
    DATABASE_ECHO: bool = False
    REDIS_URL: str = "redis://localhost:6379/0"

    # ─── Authentication ────────────────────────────────────────
    JWT_SECRET_KEY: str = "change-me-in-production"  # Override in production
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60
    JWT_REFRESH_EXPIRATION_MINUTES: int = 10080  # 7 days
    OAUTH2_JWKS_URL: Optional[str] = None

    # ─── Security ─────────────────────────────────────────────
    CSRF_SECRET_KEY: Optional[str] = None
    SESSION_TIMEOUT_MINUTES: int = 60
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW_SECONDS: int = 60
    MAX_LOGIN_ATTEMPTS: int = 5
    LOGIN_LOCKOUT_MINUTES: int = 15

    # ─── AI Services ───────────────────────────────────────────
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4"
    ANTHROPIC_API_KEY: Optional[str] = None
    ANTHROPIC_MODEL: str = "claude-3-opus-20240229"
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-pro"
    FALLBACK_MODEL_PRIORITY: list[str] = ["openai", "anthropic", "gemini"]

    # ─── External APIs ─────────────────────────────────────────
    MAPBOX_TOKEN: str = ""
    WEATHER_API_KEY: Optional[str] = None
    METRO_API_KEY: Optional[str] = None

    # ─── Mock Mode ─────────────────────────────────────────────
    USE_MOCK_DATA: bool = True
    MOCK_UPDATE_INTERVAL_SECONDS: int = 5

    # ─── Logging ───────────────────────────────────────────────
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
    LOG_TO_FILE: bool = False

    # ─── Predictive Analytics ──────────────────────────────────
    PREDICTION_CONFIDENCE_THRESHOLD: float = 0.7
    CROWD_DENSITY_HIGH_THRESHOLD: float = 90.0
    CROWD_DENSITY_MEDIUM_THRESHOLD: float = 75.0
    CONGESTION_HIGH_PROBABILITY: float = 0.8
    CONGESTION_MEDIUM_PROBABILITY: float = 0.5

    # ─── Accessibility ─────────────────────────────────────────
    WCAG_COMPLIANCE_LEVEL: str = "AA"
    SUPPORTED_LANGUAGES: list[str] = [
        "en", "es", "fr", "de", "it", "pt", "ar", "zh", "ja", "ko", "hi"
    ]

    model_config = {"env_file": ".env", "case_sensitive": True}


@lru_cache()
def get_settings() -> Settings:
    """Get cached application settings singleton."""
    return Settings()