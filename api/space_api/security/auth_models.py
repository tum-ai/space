from dataclasses import dataclass


@dataclass
class AuthenticatedUser:
    user_id: str
    first_name: str
    last_name: str
    name: str
    email: str
    picture_url: str
    email_verified: bool
