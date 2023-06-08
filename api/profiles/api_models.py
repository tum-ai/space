from datetime import (
    date,
    datetime,
)
from typing import (
    List,
    Literal,
    Optional,
)

from pydantic import (
    BaseModel,
)

from database.db_models import (
    Department,
    DepartmentMembership,
    JobHistoryElement,
    PositionType,
    Profile,
    Role,
    RoleHoldership,
    SocialNetwork,
    SocialNetworkType,
)

# department operations ##################################################################

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
            description=department.description,
        )

    @classmethod
    def dummy(cls) -> "DepartmentOut":
        return DepartmentOut.parse_obj(cls.Config.schema_extra["example"])

    # TODO evaluate if member this here (or first 10 members) or in separate endpoint
    # TODO most recent projects? or in extra endpoint

    class Config:
        schema_extra = {
            "example": {
                "handle": "dev",
                "name": "Development & IT",
                "description": "We are responsible for all IT "
                + "and engineering related tasks!",
            }
        }


# profile operations #####################################################################


class RoleInOut(BaseModel):
    handle: str
    description: str

    @classmethod
    def from_db_model(cls, role: Role) -> "RoleInOut":
        return RoleInOut(handle=role.handle, description=role.description)

    @classmethod
    def dummy(cls) -> "RoleInOut":
        return RoleInOut.parse_obj(cls.Config.schema_extra["example"])

    class Config:
        schema_extra = {
            "example": {
                "handle": "admin",
                "description": "Administrator",
            }
        }


class ProfileMemberInvitation(BaseModel):
    email: str
    first_name: str
    last_name: str
    department_handle: str
    department_position: str

    @classmethod
    def dummy(cls) -> "ProfileMemberInvitation":
        return ProfileMemberInvitation.parse_obj(cls.Config.schema_extra["example"])

    class Config:
        schema_extra = {
            "example": {
                "email": "test@mymail.com",
                "first_name": "Max",
                "last_name": "Mustermann",
                "department_handle": "DEV",
                "department_position": "MEMBER",
            }
        }


class SocialNetworkIn(BaseModel):
    type: SocialNetworkType
    handle: Optional[str]
    link: Optional[str]

    @classmethod
    def dummy(cls) -> "SocialNetworkIn":
        return SocialNetworkIn(type=SocialNetworkType.GITHUB, handle="tum_ai", link="")

    class Config:
        schema_extra = {
            "example": {
                "type": SocialNetworkType.GITHUB,
                "handle": "tum_ai",
                "link": "",
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
            profile_id=s.profile_id, type=s.type, handle=s.handle, link=s.link
        )

    @classmethod
    def dummy(cls) -> "SocialNetworkOut":
        return SocialNetworkOut.parse_obj(cls.Config.schema_extra["example"])

    class Config:
        schema_extra = {
            "example": {
                "profile_id": 32,
                "type": SocialNetworkType.GITHUB,
                "handle": "tum_ai",
                "link": "",
            }
        }


class DepartmentMembershipOut(BaseModel):
    profile_id: int
    position: PositionType
    department_handle: str
    time_from: Optional[datetime]
    time_to: Optional[datetime]

    @classmethod
    def from_db_model(cls, s: DepartmentMembership) -> "DepartmentMembershipOut":
        return DepartmentMembershipOut(
            profile_id=s.profile_id,
            position=s.position,
            department_handle=s.department_handle,
            time_from=s.time_from,
            time_to=s.time_to,
        )

    @classmethod
    def dummy(cls) -> "DepartmentMembershipOut":
        return DepartmentMembershipOut.parse_obj(cls.Config.schema_extra["example"])

    class Config:
        schema_extra = {
            "example": {
                "profile_id": 32,
                "position": PositionType.TEAMLEAD,
                "department_handle": "DEV",
            }
        }


class ProfileInCreateUpdateBase(BaseModel):
    email: str
    phone: Optional[str]
    first_name: str
    last_name: str
    birthday: Optional[date]
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

    @classmethod
    def dummy(cls) -> "ProfileInCreateUpdateBase":
        return ProfileInCreateUpdateBase.parse_obj(cls.Config.schema_extra["example"])

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
    firebase_uid: str

    email: str
    phone: Optional[str]
    first_name: str
    last_name: str
    birthday: Optional[date]
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
    department_memberships: List["DepartmentMembershipOut"]

    @classmethod
    def from_db_model(cls, profile: Profile) -> "ProfileOut":
        return ProfileOut(
            id=profile.id,
            firebase_uid=profile.firebase_uid,
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
            department_memberships=[
                DepartmentMembershipOut.from_db_model(s)
                for s in profile.department_memberships
            ],
        )

    @classmethod
    def dummy(cls) -> "ProfileOut":
        return ProfileOut.parse_obj(cls.Config.schema_extra["example"])

    class Config:
        schema_extra = {
            "example": {
                "id": 42,
                "firebase_uid": "SnMRJyesPzZI6teM684qhUxgH2g2",
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
                "department_memberships": [
                    DepartmentMembershipOut.dummy(),
                    DepartmentMembershipOut.dummy(),
                ],
            }
        }


class ProfileOutPublic(BaseModel):
    id: int

    first_name: str
    last_name: str
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
    department_memberships: List["DepartmentMembershipOut"]

    @classmethod
    def from_db_model(cls, profile: Profile) -> "ProfileOutPublic":
        return ProfileOutPublic(
            id=profile.id,
            first_name=profile.first_name,
            last_name=profile.last_name,
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
            department_memberships=[
                DepartmentMembershipOut.from_db_model(s)
                for s in profile.department_memberships
            ],
        )

    @classmethod
    def dummy(cls) -> "ProfileOutPublic":
        return ProfileOutPublic.parse_obj(cls.Config.schema_extra["example"])

    class Config:
        schema_extra = {
            "example": {
                "id": 42,
                "first_name": "Max",
                "last_name": "Mustermann",
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
                "department_memberships": [
                    DepartmentMembershipOut.dummy(),
                    DepartmentMembershipOut.dummy(),
                ],
            }
        }


class UpdateProfile(BaseModel):
    class Settings:
        template = "profiles"


class RoleHoldershipInOut(BaseModel):
    profile: ProfileOutPublic
    role: RoleInOut

    @classmethod
    def from_db_model(cls, role_holdership: RoleHoldership) -> "RoleHoldershipInOut":
        return RoleHoldershipInOut(
            profile=ProfileOutPublic.from_db_model(role_holdership.profile),
            role=RoleInOut.from_db_model(role_holdership.role),
        )

    @classmethod
    def dummy(cls) -> "RoleHoldershipInOut":
        return RoleHoldershipInOut.parse_obj(cls.Config.schema_extra["example"])

    class Config:
        schema_extra = {
            "example": {
                "profile": ProfileOutPublic.dummy(),
                "role": RoleInOut.dummy(),
            }
        }


class RoleHoldershipUpdateInOut(BaseModel):
    profile_id: int
    role_handle: str
    method: Literal["create", "delete"]

    @classmethod
    def from_db_model(
        cls, role_holdership: RoleHoldership, method: Literal["create", "delete"]
    ) -> "RoleHoldershipUpdateInOut":
        return RoleHoldershipUpdateInOut(
            profile_id=role_holdership.profile_id,
            role_handle=role_holdership.role_handle,
            method=method,
        )

    @classmethod
    def dummy(cls) -> "RoleHoldershipUpdateInOut":
        return RoleHoldershipUpdateInOut.parse_obj(cls.Config.schema_extra["example"])

    class Config:
        schema_extra = {
            "example": {
                "profile_id": 42,
                "role_handle": "invite_members",
                "method": "create",
            }
        }
