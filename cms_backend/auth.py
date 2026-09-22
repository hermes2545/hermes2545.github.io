"""Google ID-token verification for the owner-only CMS backend."""

from __future__ import annotations

import os

from google.auth.transport import requests
from google.oauth2 import id_token


class AuthError(PermissionError):
    pass


def allowed_owner_email() -> str:
    value = os.environ.get("CMS_ALLOWED_EMAIL", "").strip().lower()
    if not value:
        raise AuthError("CMS_ALLOWED_EMAIL is not configured")
    return value


def verify_owner_id_token(token: str, *, client_id: str | None = None) -> dict:
    audience = client_id or os.environ.get("GOOGLE_OAUTH_CLIENT_ID")
    if not audience:
        raise AuthError("GOOGLE_OAUTH_CLIENT_ID is not configured")
    try:
        claims = id_token.verify_oauth2_token(token, requests.Request(), audience)
    except Exception as exc:  # pragma: no cover - depends on Google response
        raise AuthError(f"invalid Google ID token: {exc}") from exc
    email = str(claims.get("email", "")).lower()
    if not claims.get("email_verified"):
        raise AuthError("Google email is not verified")
    if email != allowed_owner_email():
        raise AuthError("this Google account is not allowed to access the CMS")
    return claims
