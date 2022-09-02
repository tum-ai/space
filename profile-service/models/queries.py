from pydantic import BaseModel


class ProfileQuery(BaseModel):
    department: str | None = None
    role: str | None = None
