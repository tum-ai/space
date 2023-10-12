import logging
import traceback

import requests
from auth0.management import Auth0
from jose.constants import ALGORITHMS
from jose.exceptions import ExpiredSignatureError, JWTError
from jose.jwt import decode

from space_api.security.auth0 import get_user
from space_api.security.auth_models import AuthenticatedUser


def validate_jwt(auth0: Auth0, bearer_token: str) -> AuthenticatedUser | None:
    # TODO: custom dataclass wrapper for return dict

    # TODO: use .env
    jwks_url = "https://staging-space-tum-ai.eu.auth0.com/.well-known/jwks.json"
    aud = "https://api.space.staging.tum-ai.com/auth"
    issuer = "https://staging-space-tum-ai.eu.auth0.com/"

    response = requests.get(jwks_url)
    if response.status_code != 200:
        raise Exception("Failed to fetch JWKS from the URL.")

    jwks_data = response.json()

    try:
        decoded_token = decode(
            bearer_token.replace("Bearer ", "").replace("bearer ", ""),
            jwks_data,
            algorithms=ALGORITHMS.RS256,
            audience=aud,
            issuer=issuer,
        )

        logging.debug(f"JWT is valid: {decoded_token}")

        if not decoded_token.get("sub"):
            raise JWTError("No sub claim in JWT.")

        # fetch user info from auth0
        user = get_user(auth0, decoded_token["sub"])

        if not user or not user.get("user_id"):
            raise JWTError("User not found.")

        if not user.get("email_verified"):
            raise JWTError("User email not verified.")

        return AuthenticatedUser(
            user_id=user["user_id"],
            first_name=user["given_name"],
            last_name=user["family_name"],
            name=user["name"],
            email=user["email"],
            picture_url=user["picture"],
            email_verified=user["email_verified"],
        )
    except ExpiredSignatureError:
        logging.error("JWT has expired.")
    except JWTError as e:
        traceback.print_exc()
        logging.error("Authentication failed: Token could not be verified:", e)

    return None
