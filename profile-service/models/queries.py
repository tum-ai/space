from pydantic import BaseModel


class ProfileQuery(BaseModel):
    """
    Definition of the query-like request body used in get_profiles as a model
    """
    department: str | None = None
    role: str | None = None
