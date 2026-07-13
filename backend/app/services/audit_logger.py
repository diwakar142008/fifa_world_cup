"""Audit Logging Service for Security and Compliance."""

import json
from datetime import datetime, timezone
from typing import Any, Optional
import logging
from app.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)


class AuditLogger:
    """Logs security-relevant events for compliance and monitoring."""

    @staticmethod
    def log_event(
        event_type: str,
        user_id: Optional[str] = None,
        action: str = "",
        resource: str = "",
        status: str = "success",
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        metadata: Optional[dict] = None,
    ) -> dict:
        """Log an audit event."""
        event = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "event_type": event_type,
            "user_id": user_id,
            "action": action,
            "resource": resource,
            "status": status,
            "ip_address": ip_address,
            "user_agent": user_agent,
            "metadata": metadata or {},
        }
        
        # Log to structured logging
        logger.info(
            "AUDIT",
            extra={
                "audit_event": event,
                "event_type": event_type,
                "user_id": user_id,
                "status": status,
            }
        )
        
        return event

    @staticmethod
    def log_authentication(user_id: str, status: str, ip: str = "") -> dict:
        """Log authentication events."""
        return AuditLogger.log_event(
            event_type="authentication",
            user_id=user_id,
            action="login" if status == "success" else "failed_login",
            status=status,
            ip_address=ip,
        )

    @staticmethod
    def log_authorization(user_id: str, resource: str, action: str, status: str) -> dict:
        """Log authorization/access control events."""
        return AuditLogger.log_event(
            event_type="authorization",
            user_id=user_id,
            action=action,
            resource=resource,
            status=status,
        )

    @staticmethod
    def log_data_access(user_id: str, resource_type: str, resource_id: str) -> dict:
        """Log data access events."""
        return AuditLogger.log_event(
            event_type="data_access",
            user_id=user_id,
            action="read",
            resource=f"{resource_type}:{resource_id}",
            status="success",
        )

    @staticmethod
    def log_security_event(event_type: str, details: str, severity: str = "medium") -> dict:
        """Log security incidents."""
        return AuditLogger.log_event(
            event_type=f"security_{event_type}",
            action=details,
            status="detected",
            metadata={"severity": severity},
        )


# Global audit logger instance (named 'audit_logger' for import consistency)
audit_logger = AuditLogger()
audit = audit_logger  # Backward compatibility alias