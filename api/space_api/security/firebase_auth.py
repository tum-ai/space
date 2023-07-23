from pathlib import Path

import firebase_admin  # type: ignore
from firebase_admin import App, auth, credentials  # type: ignore
from firebase_admin.auth import UserRecord  # type: ignore
from firebase_admin.exceptions import AlreadyExistsError  # type: ignore

API_ROOT_DIR = Path(__file__).parent.parent


def init_firebase_auth() -> App:
    cred = credentials.Certificate(
        API_ROOT_DIR.parent / ".secrets" / "tumai-space-firebase-adminsdk.json"
    )
    app = firebase_admin.initialize_app(cred)
    return app


def verify_id_token(jwt: str) -> UserRecord | None:
    try:
        user = auth.verify_id_token(jwt)
        return user
    except Exception as e:
        print(e)
        return None


def create_invite_email_user(display_name: str, email: str) -> UserRecord | str:
    """
    Returns:
        UserRecord: if successful
        str: error message if unsuccessful
    """
    try:
        new_user: UserRecord = auth.create_user(
            display_name=display_name, email=email, email_verified=False
        )
        return new_user
    except AlreadyExistsError:
        return "UserAlreadyExists"
    except Exception:
        return "FirebaseError"


def generate_reset_password_link(email):
    return auth.generate_password_reset_link(email, None)
