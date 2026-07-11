"""Advanced security tests for CSRF, token blacklist, audit logging."""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.middleware.token_blacklist import TokenBlacklist
from app.services.audit_logger import AuditLogger


client = TestClient(app)


class TestTokenBlacklist:
    """Test JWT token blacklist functionality."""

    def test_revoke_session(self):
        """Test session revocation."""
        TokenBlacklist.revoke_session("test-session-123")
        # Session should be blacklisted
        assert "test-session-123" in TokenBlacklist._revoked_sessions()

    def test_cleanup_expired(self):
        """Test cleanup of expired blacklisted tokens."""
        TokenBlacklist.revoke_session("session-to-cleanup")
        TokenBlacklist.cleanup_expired()
        # Just ensure it runs without error


class TestAuditLogging:
    """Test audit logging functionality."""

    def test_log_authentication(self):
        """Test authentication audit logging."""
        event = AuditLogger.log_authentication("user-123", "success", "127.0.0.1")
        assert event["event_type"] == "authentication"
        assert event["user_id"] == "user-123"
        assert event["status"] == "success"
        assert event["ip_address"] == "127.0.0.1"

    def test_log_authorization(self):
        """Test authorization audit logging."""
        event = AuditLogger.log_authorization("user-123", "api/ai", "chat", "denied")
        assert event["event_type"] == "authorization"
        assert event["resource"] == "api/ai"
        assert event["status"] == "denied"

    def test_log_security_event(self):
        """Test security event logging."""
        event = AuditLogger.log_security_event("sql_injection", "Blocked SQL attempt", "high")
        assert event["event_type"] == "security_sql_injection"
        assert event["status"] == "detected"
        assert event["metadata"]["severity"] == "high"


class TestCSRFProtection:
    """Test CSRF middleware."""