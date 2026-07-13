"""Redis Caching Service for Performance Optimization."""

import json
import logging
from typing import Any, Optional, Callable, Awaitable

try:
    import redis.asyncio as aioredis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False

from app.config import get_settings

logger = logging.getLogger("stadiummind.cache")
settings = get_settings()


class CacheService:
    """Redis-based caching service for API responses and computed data."""

    def __init__(self):
        self.redis_client: Optional[aioredis.Redis] = None
        self._connected = False

    async def connect(self) -> None:
        """Connect to Redis."""
        if self._connected:
            return
        if not REDIS_AVAILABLE:
            logger.warning("Redis package not installed, cache disabled")
            return
        try:
            self.redis_client = aioredis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5,
            )
            self._connected = True
            logger.info("Redis cache connected")
        except Exception as e:
            logger.warning(f"Redis connection failed: {e}")
            self.redis_client = None

    async def disconnect(self) -> None:
        """Disconnect from Redis."""
        if self.redis_client:
            await self.redis_client.close()
            self._connected = False

    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache."""
        if not self.redis_client:
            return None
        try:
            value = await self.redis_client.get(key)
            if value:
                return json.loads(value)
        except Exception as e:
            logger.debug(f"Cache get error for {key}: {e}")
        return None

    async def set(
        self,
        key: str,
        value: Any,
        expire: int = 300,
    ) -> bool:
        """Set value in cache with expiration (seconds)."""
        if not self.redis_client:
            return False
        try:
            await self.redis_client.set(
                key,
                json.dumps(value, default=str),
                ex=expire,
            )
            return True
        except Exception as e:
            logger.debug(f"Cache set error for {key}: {e}")
            return False

    async def delete(self, key: str) -> bool:
        """Delete key from cache."""
        if not self.redis_client:
            return False
        try:
            await self.redis_client.delete(key)
            return True
        except Exception as e:
            logger.debug(f"Cache delete error for {key}: {e}")
            return False

    async def clear_pattern(self, pattern: str) -> int:
        """Clear all keys matching pattern."""
        if not self.redis_client:
            return 0
        try:
            keys = await self.redis_client.keys(pattern)
            if keys:
                await self.redis_client.delete(*keys)
                return len(keys)
        except Exception as e:
            logger.debug(f"Cache clear pattern error for {pattern}: {e}")
        return 0

    async def get_or_set(
        self,
        key: str,
        callback: Callable[[], Awaitable[Any]],
        expire: int = 300,
    ) -> Any:
        """Get from cache or execute callback and cache result."""
        cached = await self.get(key)
        if cached is not None:
            return cached
        result = await callback()
        await self.set(key, result, expire)
        return result


# Global cache instance
cache = CacheService()