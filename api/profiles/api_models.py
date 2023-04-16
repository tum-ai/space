from typing import Optional, List

from pydantic import BaseModel
from datetime import date, datetime

from profiles.db_models import SocialNetworkType, Department, Profile, JobHistoryElement, SocialNetwork


# department operations ################################################################################################

# class DepartmentCreate(BaseModel):
# creation only via postgres directly!


# class DepartmentUpdate(BaseModel):
# update only via postgres directly!


class DepartmentOut(BaseModel):
    handle: str

    name: str
    description: str

    @classmethod
    def from_db_model(cls, department: Department) -> "DepartmentOut":
        return DepartmentOut(
            handle=department.handle,
            name=department.name,
            description=department.description
        )

    @classmethod
    def dummy(cls) -> "DepartmentOut":
        return DepartmentOut(
            handle="dummy",
            name="DummyDepartment",
            description="This is a dummy department!"
        )

    # TODO evaluate if member this here (or first 10 members) or in separate endpoint
    # TODO most recent projects? or in extra endpoint

    class Config:
        schema_extra = {
            "example": {
                "handle": "dev",
                "name": "Development & IT",
                "description": "We are responsible for all IT and engineering related tasks!"
            }
        }

# profile operations ###################################################################################################


class SocialNetworkIn(BaseModel):
    type: SocialNetworkType
    handle: Optional[str]
    link: Optional[str]

    @classmethod
    def dummy(cls) -> "SocialNetworkIn":
        return SocialNetworkIn(
            type=SocialNetworkType.GITHUB,
            handle="tum_ai",
            link=""
        )

    class Config:
        schema_extra = {
            "example": {
                "type": SocialNetworkType.GITHUB,
                "handle": "tum_ai",
                "link": ""
            }
        }


class SocialNetworkOut(BaseModel):
    profile_id: int
    type: SocialNetworkType
    handle: Optional[str]
    link: Optional[str]

    @classmethod
    def from_db_model(cls, s: SocialNetwork) -> "SocialNetworkOut":
        return SocialNetworkOut(
            profile_id=s.profile_id,
            type=s.type,
            handle=s.handle,
            link=s.link
        )

    @classmethod
    def dummy(cls) -> "SocialNetworkOut":
        return SocialNetworkOut(
            profile_id=32,
            type=SocialNetworkType.GITHUB,
            handle="tum_ai",
            link=""
        )

    class Config:
        schema_extra = {
            "example": {
                "profile_id": 32,
                "type": SocialNetworkType.GITHUB,
                "handle": "tum_ai",
                "link": ""
            }
        }


class ProfileInCreateUpdateBase(BaseModel):
    email: str
    phone: Optional[str]
    first_name: str
    last_name: str
    birthday: date
    nationality: Optional[str]
    description: Optional[str]

    # profile_picture  # TODO

    activity_status: Optional[str]

    degree_level: Optional[str]
    degree_name: Optional[str]
    degree_semester: Optional[int]
    university: Optional[str]
    job_history: List[JobHistoryElement]
    time_joined: Optional[datetime]

    social_networks: List["SocialNetworkIn"]

    class Config:
        schema_extra = {
            "example": {
                "email": "test@mymail.com",
                "phone": "+42 42424242",
                "first_name": "Max",
                "last_name": "Mustermann",
                "birthday": date(2000, 12, 30),
                "nationality": "German",
                "description": "Hi and welcome!",
                "activity_status": "active",
                "degree_level": "B.Sc.",
                "degree_name": "Computer Science",
                "degree_semester": "5",
                "university": "TUM",
                "job_history": [
                    JobHistoryElement.dummy(),
                    JobHistoryElement.dummy(),
                ],
                "time_joined": datetime.now(),
                "social_networks": [
                    SocialNetworkIn.dummy(),
                    SocialNetworkIn.dummy(),
                ],
            }
        }


class ProfileInCreate(ProfileInCreateUpdateBase):
    pass


class ProfileInUpdate(ProfileInCreateUpdateBase):
    pass


# only for privileged users
class ProfileOut(BaseModel):
    id: int
    supertokens_id: Optional[str]

    email: str
    phone: Optional[str]
    first_name: str
    last_name: str
    birthday: date
    nationality: Optional[str]
    description: Optional[str]

    # profile_picture  # TODO

    activity_status: Optional[str]

    degree_level: Optional[str]
    degree_name: Optional[str]
    degree_semester: Optional[int]
    university: Optional[str]
    job_history: List[JobHistoryElement]
    time_joined: Optional[datetime]

    social_networks: List["SocialNetworkOut"]

    @classmethod
    def from_db_model(cls, profile: Profile) -> "ProfileOut":
        return ProfileOut(
            id=profile.id,
            supertokens_id=profile.supertokens_id,

            email=profile.email,
            phone=profile.phone,
            first_name=profile.first_name,
            last_name=profile.last_name,
            birthday=profile.birthday,
            nationality=profile.nationality,
            description=profile.description,

            activity_status=profile.activity_status,

            degree_level=profile.degree_level,
            degree_name=profile.degree_name,
            degree_semester=profile.degree_semester,
            university=profile.university,
            job_history=profile.decoded_job_history,
            time_joined=profile.time_joined,
            social_networks=[
                SocialNetworkOut.from_db_model(s) for s in profile.social_networks
            ],
        )

    @classmethod
    def dummy(cls) -> "ProfileOut":
        return ProfileOut(
            id=2,
            supertokens_id="asdfHIUSF7",

            email="test@mymail.com",
            phone="+42 42424242",
            first_name="Max",
            last_name="Mustermann",
            birthday=date(2000, 12, 30),
            nationality="German",
            description="Hi and welcome!",
            activity_status="active",
            degree_level="B.Sc.",
            degree_name="Computer Science",
            degree_semester="5",
            university="TUM",
            job_history=[
                JobHistoryElement.dummy(),
                JobHistoryElement.dummy(),
            ],
            time_joined=datetime.now(),
            social_networks=[
                SocialNetworkOut.dummy(),
                SocialNetworkOut.dummy(),
            ],
        )

    class Config:
        schema_extra = {
            "example": {
                "id": 42,
                "supertokens_id": "asdfHIUSF7",

                "email": "test@mymail.com",
                "phone": "+42 42424242",
                "first_name": "Max",
                "last_name": "Mustermann",
                "birthday": date(2000, 12, 30),
                "nationality": "German",
                "description": "Hi and welcome!",
                "activity_status": "active",
                "degree_level": "B.Sc.",
                "degree_name": "Computer Science",
                "degree_semester": "5",
                "university": "TUM",
                "job_history": [
                    JobHistoryElement.dummy(),
                    JobHistoryElement.dummy(),
                ],
                "time_joined": datetime.now(),
                "social_networks": [
                    SocialNetworkOut.dummy(),
                    SocialNetworkOut.dummy(),
                ],
            }
        }


class ProfileOutPublic(BaseModel):
    id: int

    first_name: str
    last_name: str
    nationality: Optional[str]
    description: Optional[str]

    # profile_picture  # TODO

    activity_status: Optional[str]

    degree_level: Optional[str]
    degree_name: Optional[str]
    degree_semester: Optional[int]
    university: Optional[str]
    job_history: List[JobHistoryElement]
    time_joined: Optional[datetime]

    social_networks: List["SocialNetworkOut"]

    @classmethod
    def from_db_model(cls, profile: Profile) -> "ProfileOut":
        return ProfileOutPublic(
            id=profile.id,

            first_name=profile.first_name,
            last_name=profile.last_name,
            nationality=profile.nationality,
            description=profile.description,

            activity_status=profile.activity_status,

            degree_level=profile.degree_level,
            degree_name=profile.degree_name,
            degree_semester=profile.degree_semester,
            university=profile.university,
            job_history=profile.decoded_job_history,
            time_joined=profile.time_joined,
            social_networks=[
                SocialNetworkOut.from_db_model(s) for s in profile.social_networks
            ],
        )

    @classmethod
    def dummy(cls) -> "ProfileOutPublic":
        return ProfileOutPublic(
            id=2,

            first_name="Max",
            last_name="Mustermann",
            nationality="German",
            description="Hi and welcome!",

            activity_status="active",

            degree_level="B.Sc.",
            degree_name="Computer Science",
            degree_semester="5",
            university="TUM",
            job_history=[
                JobHistoryElement.dummy(),
                JobHistoryElement.dummy(),
            ],
            time_joined=datetime.now(),
            social_networks=[
                SocialNetworkOut.dummy(),
                SocialNetworkOut.dummy(),
            ],
        )

    class Config:
        schema_extra = {
            "example": {
                "id": 42,

                "first_name": "Max",
                "last_name": "Mustermann",
                "nationality": "German",
                "description": "Hi and welcome!",
                "activity_status": "active",
                "degree_level": "B.Sc.",
                "degree_name": "Computer Science",
                "degree_semester": "5",
                "university": "TUM",
                "job_history": [
                    JobHistoryElement.dummy(),
                    JobHistoryElement.dummy(),
                ],
                "time_joined": datetime.now(),
                "social_networks": [
                    SocialNetworkIn.dummy(),
                    SocialNetworkIn.dummy(),
                ],
            }
        }


class UpdateProfile(BaseModel):
    class Settings:
        template = "profiles"
