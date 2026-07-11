"""JWT Token Blacklist for Logout and Session Management."""

from datetime import datetime, timedelta
from typing import Set
from jose import jwt, JWTError
from app.config import get_settings

settings = get_settings()

# In-memory token blacklist (use Redis in production)
token_blacklist: Set[str] = {}
revoked_sessions: dict = {}


class TokenBlacklist:
    """Manages revoked tokens and sessions."""

    @staticmethod
    def revoke_token(token: str, wait: str) -> None:
        """Revoke a JWT token by adding to blacklist."""
        try:
            payload = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM],
                options={"verify_exp": False}
            )
            exp = payload.get("exp")
            if exp:
                # Store with expiry time
                revoked_sessions[token] = datetime.utcnow() + timedelta(seconds=exp - datetime.utcnow().timestamp())
        except JWTError:
            pass

    @staticmethod
    def revoke_session(session_id: str) -> None:
        """Revoke all tokens for a session."""
        revoked_sessions[session_id] = datetime.utcnow() + timedelta(hours=24)

    @staticmethod
    def is_revoked(token: str) -> bool:
        """Check if token is revoked."""
        if token in revoked_sessions:
            revoked_at = revoked_sessions[token]
            if isinstance(revoked_at, datetime):
                if datetime.utcnow() > revoked_at:
                    del revoked_sessions[token]
                    return False
            return True
        return False

    @staticmethod
    def cleanup_expired() -> None:
        """Remove expired blacklisted tokens."""
        now = datetime.utcnow()
        expired = [
            token for token, ts in revoked_sessions.items()
            if isinstance(ts, datetime) and now > ts
        ]
        for token in expired:
            del revoked_sessions[token]

    @staticmethod
    def _revoked_sessions() -> dict:
        """Access revoked sessions for testing."""
        return revoked_sessions
