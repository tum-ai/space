from pathlib import (
    Path,
)

import firebase_admin
from firebase_admin import (
    auth,
    credentials,
)

ROOT = Path(__file__)


def init_firebase_auth():
    cred = credentials.Certificate(
        ROOT.parent.parent / ".secrets" / "tumai-space-firebase-adminsdk.json"
    )
    app = firebase_admin.initialize_app(cred)


def verify_id_token(jwt):
    try:
        user = auth.verify_id_token(jwt)
        return user
    except Exception as e:
        print(e)
        return None
