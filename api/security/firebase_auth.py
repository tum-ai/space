from pathlib import (
    Path,
)
from typing import (
    Tuple,
)

import firebase_admin
from firebase_admin import (
    App,
    auth,
    credentials,
)
from firebase_admin.auth import (
    UserRecord,
)

ROOT = Path(__file__)


def init_firebase_auth():
    cred = credentials.Certificate(
        ROOT.parent.parent / ".secrets" / "tumai-space-firebase-adminsdk.json"
    )
    app = firebase_admin.initialize_app(cred)
    return app


def verify_id_token(jwt):
    try:
        user = auth.verify_id_token(jwt)
        return user
    except Exception as e:
        print(e)
        return None


def create_invite_email_user(display_name: str, email: str) -> Tuple[UserRecord, str]:
    # TODO: handle email already exists
    new_user: UserRecord = auth.create_user(
        display_name=display_name, email=email, email_verified=False
    )
    email_activation_link = auth.generate_email_verification_link(new_user.email)
    print(email_activation_link)
    return new_user, email_activation_link
