from pathlib import (
    Path,
)

# import firebase_admin
# from firebase_admin import (
#     auth,
#     credentials,
# )

ROOT = Path(__file__)


def init_firebase_auth():
    pass
    # credentials = credentials.Certificate(
    #     ROOT.parent / ".secrets" / "tumai-space-firebase-adminsdk-8bc08-452ccb2773.json"
    # )
    # app = firebase_admin.initialize_app(credentials)


def verify_id_token(jwt):
    pass
    # user = auth.verify_id_token(jwt)
    # return user
