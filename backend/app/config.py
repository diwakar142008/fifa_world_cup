"""StadiumMind AI — Application Configuration.

Centralized settings loaded from environment variables with sensible defaults
for development, testing, and production environments.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # ─── Application ───────────────────────────────────────────
    APP_NAME: str = "StadiumMind AI"
    APP_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    DEBUG: bool = True

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
    JWT_SECRET_KEY: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60
    OAUTH2_JWKS_URL: str | None = None

    # ─── AI Services ───────────────────────────────────────────
    OPENAI_API_KEY: str | None = None
    OPENAI_MODEL: str = "gpt-4"
    ANTHROPIC_API_KEY: str | None = None
    GEMINI_API_KEY: str | None = None

    # ─── External APIs ─────────────────────────────────────────
    MAPBOX_TOKEN: str = ""
    WEATHER_API_KEY: str | None = None
    METRO_API_KEY: str | None = None

    # ─── Rate Limiting ─────────────────────────────────────────
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW_SECONDS: int = 60

    # ─── Mock Mode ─────────────────────────────────────────────
    USE_MOCK_DATA: bool = True
    MOCK_UPDATE_INTERVAL_SECONDS: int = 5

    # ─── Logging ───────────────────────────────────────────────
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"

    model_config = {"env_file": ".env", "case_sensitive": True}


@lru_cache()
def get_settings() -> Settings:
    return Settings()
