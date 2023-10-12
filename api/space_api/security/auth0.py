import os
import secrets
import string
from typing import Any

from auth0.authentication import GetToken
from auth0.management import Auth0


def init_auth0() -> Auth0:
    issuer_base_url = (
        "staging-space-tum-ai.eu.auth0.com"  # os.environ["ADMIN_AUTH0_ISSUER_BASE_URL"]
    )
    non_interactive_client_id = os.environ["ADMIN_AUTH0_CLIENT_ID"]
    non_interactive_client_secret = os.environ["ADMIN_AUTH0_CLIENT_SECRET"]

    get_token = GetToken(
        issuer_base_url,
        non_interactive_client_id,
        client_secret=non_interactive_client_secret,
    )
    admin_tok = get_token.client_credentials(f"https://{issuer_base_url}/api/v2/")
    mgmt_api_token = admin_tok["access_token"]

    auth0client = Auth0(issuer_base_url, mgmt_api_token)
    return auth0client


def get_user(auth0client: Auth0, user_id: str) -> dict[str, Any]:
    user = auth0client.users.get(id=user_id)
    return user


def request_email_verification(auth0client: Auth0, user_id: str) -> bool:
    """
    Returns:
        True if the request was successful.
    """

    user = get_user(auth0client, user_id)
    if user.get("email_verified"):
        raise Exception("Email already verified.")
    auth0client.users.update(user_id, {"verify_email": True})
    return True


def create_new_user(auth0client: Auth0) -> dict[str, Any]:
    """
    Returns:
        The created user.
    """

    rand_pw = "".join(
        secrets.choice(string.ascii_letters + string.digits) for i in range(30)
    )

    database_conn = "Username-Password-Authentication"
    user = auth0client.users.create(
        {
            "email": "robin.holzingr@gmail.com",
            "blocked": False,
            "email_verified": False,
            "app_metadata": {},
            "given_name": "Robin1",
            "family_name": "Holzinger2",
            "name": "[Robin1] [Holzinger2]",
            "nickname": "robinholzi",
            "connection": database_conn,
            "password": rand_pw,
            "verify_email": True,
        }
    )

    return user
