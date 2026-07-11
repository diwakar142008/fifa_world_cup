"""Authentication API endpoints with real JWT, bcrypt, and RBAC."""

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.schemas.base import APIResponse, LoginRequest, TokenResponse
from datetime import datetime, timedelta, timezone
import bcrypt
from jose import jwt, JWTError
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

from app.config import get_settings
from app.middleware.token_blacklist import TokenBlacklist

settings = get_settings()
router = APIRouter(prefix="/auth", tags=["Authentication"])
security = HTTPBearer(auto_error=False)

# In-memory user store (replace with database in production)
# Demo accounts for development - override in production with real user database
USERS = {
    "admin@stadiummind.ai": {
        "password": bcrypt.hashpw("changeme-in-prod!".encode(), bcrypt.gensalt()).decode(),
        "user_id": "user-001",
        "name": "Alex Morgan",
        "role": "organizer",
    },
    "fan@stadiummind.ai": {
        "password": bcrypt.hashpw("changeme-in-prod!".encode(), bcrypt.gensalt()).decode(),
        "user_id": "user-002",
        "name": "Fan User",
        "role": "fan",
    },
}


def create_access_token(user_id: str, role: str) -> str:
    """Create a real JWT token."""
    expires = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXPIRATION_MINUTES)
    payload = {
        "sub": user_id,
        "role": role,
        "exp": expires,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    """Decode and validate a JWT token."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Dependency to get current authenticated user."""
    if credentials is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = decode_token(credentials.credentials)
    return payload


@router.post("/login")
async def login(request: LoginRequest):
    """Authenticate user with bcrypt and return real JWT token."""
    user = USERS.get(request.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not bcrypt.checkpw(request.password.encode(), user["password"].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(user["user_id"], user["role"])

    return APIResponse(data=TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=user["user_id"],
        role=user["role"],
        expires_in=settings.JWT_EXPIRATION_MINUTES * 60,
    ))


@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """Invalidate the current session."""
    # Token will be blacklisted by the client
    TokenBlacklist.revoke_session(current_user["sub"])
    return APIResponse(data={"message": "Logged out successfully"})


@router.get("/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get the currently authenticated user's profile."""
    return APIResponse(data={
        "id": current_user["sub"],
        "name": "User",
        "email": "user@stadiummind.ai",
        "role": current_user["role"],
        "avatar_url": None,
    })


@router.post("/refresh")
async def refresh_token(current_user: dict = Depends(get_current_user)):
    """Refresh the access token."""
    new_token = create_access_token(current_user["sub"], current_user["role"])
    return APIResponse(data={"access_token": new_token, "token_type": "bearer"})