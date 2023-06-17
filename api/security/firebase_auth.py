from pathlib import (
    Path,
)
from typing import (
    Union,
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

ROOT = Path(__file__)


def init_firebase_auth() -> App:
    cred = credentials.Certificate(
        ROOT.parent.parent / ".secrets" / "tumai-space-firebase-adminsdk.json"
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


def create_invite_email_user(display_name: str, email: str) -> Union[UserRecord, str]:
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
