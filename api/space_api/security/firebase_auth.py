from pathlib import (
    Path,
)

import firebase_admin  # type: ignore
from firebase_admin import (  # type: ignore
    App,
    auth,
    credentials,
)
from firebase_admin.auth import (  # type: ignore
    UserRecord,
)
from firebase_admin.exceptions import (  # type: ignore
    AlreadyExistsError,
)

ROOT_PATH = Path(__file__).parent.parent.parent


def init_firebase_auth() -> App:
    cred = credentials.Certificate(
        ROOT_PATH / ".secrets" / "tumai-space-firebase-adminsdk.json"
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
