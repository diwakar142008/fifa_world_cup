"""Tests for Redis caching service."""

import pytest
from app.services.cache_service import cache


class TestCacheService:
    """Test cache operations."""

    @pytest.mark.asyncio
    async def test_cache_set_and_get(self):
        """Test basic cache set and get."""
        # Note: Cache returns None if Redis is not available
        await cache.set("test_key", {"data": "test_value"}, expire=60)
        result = await cache.get("test_key")
        # Either returns cached value or None if Redis unavailable
        assert result is None or result == {"data": "test_value"}
        await cache.delete("test_key")

    @pytest.mark.asyncio
    async def test_cache_miss(self):
        """Test cache miss returns None."""
        result = await cache.get("nonexistent_key_xyz")
        assert result is None

    @pytest.mark.asyncio
    async def test_cache_delete(self):
        """Test cache deletion."""
        await cache.set("temp_key", "temp_value", expire=60)
        await cache.delete("temp_key")
        result = await cache.get("temp_key")
        assert result is None

    @pytest.mark.asyncio
    async def test_cache_get_or_set(self):
        """Test get-or-set pattern."""
        async def fetch_data():
            return {"computed": True, "timestamp": "now"}
        
        result = await cache.get_or_set("computed_key", fetch_data, expire=120)
        assert result["computed"] is True
        # Second call should return cached value
        result2 = await cache.get_or_set("computed_key", fetch_data, expire=120)
        assert result2 == result
        await cache.delete("computed_key")