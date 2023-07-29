from datetime import date, datetime
from typing import Any, Literal, cast

from pydantic import BaseModel, ConfigDict, Field

from space_api.database import db_models

# ------------------------------------------------------------------------------------ #
#                                 department operations                                #
# ------------------------------------------------------------------------------------ #


class DepartmentOut(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "handle": "dev",
                "name": "Development & IT",
                "description": "We are responsible for all IT "
                + "and engineering related tasks!",
            }
        }
    )

    handle: str

    name: str
    description: str

    @classmethod
    def from_db_model(cls, department: db_models.Department) -> "DepartmentOut":
        return DepartmentOut(
            handle=department.handle,
            name=department.name,
            description=department.description or "",
        )

    @classmethod
    def dummy(cls) -> "DepartmentOut":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return DepartmentOut.model_validate(json["example"])


# ------------------------------------------------------------------------------------ #
#                                  profile operations                                  #
# ------------------------------------------------------------------------------------ #


class RoleInOut(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "handle": "admin",
                "description": "Administrator",
            }
        }
    )

    handle: str
    description: str

    @classmethod
    def from_db_model(cls, role: db_models.Role) -> "RoleInOut":
        return RoleInOut(handle=role.handle, description=role.description or "")

    @classmethod
    def dummy(cls) -> "RoleInOut":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return RoleInOut.model_validate(json["example"])


class ProfileMemberInvitation(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "test@mymail.com",
                "first_name": "Max",
                "last_name": "Mustermann",
                "department_handle": "dev",
                "department_position": "Member",
            }
        }
    )

    email: str
    first_name: str
    last_name: str
    department_handle: str
    department_position: db_models.PositionType

    @classmethod
    def dummy(cls) -> "ProfileMemberInvitation":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return ProfileMemberInvitation.model_validate(json["example"])


class SocialNetworkIn(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "type": "github",
                "handle": "tum_ai",
                "link": "",
            }
        }
    )

    type: db_models.SocialNetworkType
    handle: str | None
    link: str | None

    @classmethod
    def dummy(cls) -> "SocialNetworkIn":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return SocialNetworkIn.model_validate(json["example"])


class SocialNetworkOut(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "profile_id": 32,
                "type": "github",
                "handle": "tum_ai",
                "link": "",
            }
        }
    )

    profile_id: int
    type: db_models.SocialNetworkType
    handle: str | None
    link: str | None

    @classmethod
    def from_db_model(cls, s: db_models.SocialNetwork) -> "SocialNetworkOut":
        return SocialNetworkOut(
            profile_id=s.profile_id,
            type=cast(db_models.SocialNetworkType, s.type),
            handle=s.handle,
            link=s.link,
        )

    @classmethod
    def dummy(cls) -> "SocialNetworkOut":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return SocialNetworkOut.model_validate(json["example"])


class DepartmentMembershipOut(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "profile_id": 32,
                "position": "teamlead",
                "department_handle": "DEV",
            }
        }
    )

    profile_id: int
    position: db_models.PositionType
    department_handle: str
    time_from: datetime | None = Field(None)
    time_to: datetime | None = Field(None)

    @classmethod
    def from_db_model(
        cls, s: db_models.DepartmentMembership
    ) -> "DepartmentMembershipOut":
        return DepartmentMembershipOut(
            profile_id=s.profile_id,
            position=cast(db_models.PositionType, s.position),
            department_handle=s.department_handle,
            time_from=cast(datetime, s.time_from),
            time_to=cast(datetime, s.time_to),
        )

    @classmethod
    def dummy(cls) -> "DepartmentMembershipOut":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return DepartmentMembershipOut.model_validate(json["example"])


class ProfileInCreateUpdateBase(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
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
                    db_models.JobHistoryElement.dummy(),
                    db_models.JobHistoryElement.dummy(),
                ],
                "time_joined": datetime.now(),
                "social_networks": [
                    SocialNetworkIn.dummy(),
                    SocialNetworkIn.dummy(),
                ],
            }
        }
    )

    email: str
    phone: str | None = Field(None)
    first_name: str
    last_name: str
    birthday: date | None = Field(None)
    nationality: str | None = Field(None)
    description: str | None = Field(None)

    profile_picture: str | None = Field(None)

    activity_status: str | None = Field(None)

    degree_level: str | None = Field(None)
    degree_name: str | None = Field(None)
    degree_semester: int | None = Field(None)
    university: str | None = Field(None)
    job_history: list[db_models.JobHistoryElement]
    time_joined: datetime | None = Field(None)

    social_networks: list["SocialNetworkIn"]

    @classmethod
    def dummy(cls) -> "ProfileInCreateUpdateBase":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return ProfileInCreateUpdateBase.model_validate(json["example"])


class ProfileInCreate(ProfileInCreateUpdateBase):
    pass


class ProfileInUpdate(ProfileInCreateUpdateBase):
    pass


# only for privileged users
class ProfileOut(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
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
                    db_models.JobHistoryElement.dummy(),
                    db_models.JobHistoryElement.dummy(),
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
    )

    id: int
    firebase_uid: str

    email: str
    phone: str | None = Field(None)
    first_name: str
    last_name: str
    birthday: date | None = Field(None)
    nationality: str | None = Field(None)
    description: str | None = Field(None)

    profile_picture: str | None = Field(None)

    activity_status: str | None = Field(None)

    degree_level: str | None = Field(None)
    degree_name: str | None = Field(None)
    degree_semester: int | None = Field(None)
    university: str | None = Field(None)
    job_history: list[db_models.JobHistoryElement]
    time_joined: datetime | None = Field(None)

    social_networks: list["SocialNetworkOut"]
    department_memberships: list["DepartmentMembershipOut"]

    @classmethod
    def from_db_model(cls, profile: db_models.Profile) -> "ProfileOut":
        return ProfileOut(
            id=profile.id,
            firebase_uid=profile.firebase_uid,
            email=profile.email,
            phone=profile.phone,
            first_name=profile.first_name,
            last_name=profile.last_name,
            birthday=cast(datetime, profile.birthday),
            nationality=profile.nationality,
            description=profile.description,
            activity_status=profile.activity_status,
            degree_level=profile.degree_level,
            degree_name=profile.degree_name,
            degree_semester=profile.degree_semester,
            university=profile.university,
            job_history=profile.decoded_job_history,
            time_joined=cast(datetime, profile.time_joined),
            social_networks=[
                SocialNetworkOut.from_db_model(s) for s in profile.social_networks
            ],
            department_memberships=[
                DepartmentMembershipOut.from_db_model(s)
                for s in profile.department_memberships
            ],
            profile_picture=profile.profile_picture,
        )

    @classmethod
    def dummy(cls) -> "ProfileOut":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return ProfileOut.model_validate(json["example"])


class ProfileOutPublic(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
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
                    db_models.JobHistoryElement.dummy(),
                    db_models.JobHistoryElement.dummy(),
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
    )

    id: int

    first_name: str
    last_name: str
    description: str | None = Field(None)

    profile_picture: str | None = Field(None)

    activity_status: str | None = Field(None)

    degree_level: str | None = Field(None)
    degree_name: str | None = Field(None)
    degree_semester: int | None = Field(None)
    university: str | None = Field(None)
    job_history: list[db_models.JobHistoryElement]
    time_joined: datetime | None = Field(None)

    social_networks: list["SocialNetworkOut"]
    department_memberships: list["DepartmentMembershipOut"]

    @classmethod
    def from_db_model(cls, profile: db_models.Profile) -> "ProfileOutPublic":
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
            time_joined=cast(datetime, profile.time_joined),
            social_networks=[
                SocialNetworkOut.from_db_model(s) for s in profile.social_networks
            ],
            department_memberships=[
                DepartmentMembershipOut.from_db_model(s)
                for s in profile.department_memberships
            ],
            profile_picture=profile.profile_picture,
        )

    @classmethod
    def dummy(cls) -> "ProfileOutPublic":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return ProfileOutPublic.model_validate(json["example"])


class ProfileOutPublicReduced(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": 42,
                "first_name": "Max",
                "last_name": "Mustermann",
                "description": "Hi and welcome!",
            }
        }
    )

    id: int

    first_name: str
    last_name: str
    description: str | None = Field(None)

    @classmethod
    def from_db_model(cls, profile: db_models.Profile) -> "ProfileOutPublicReduced":
        return ProfileOutPublicReduced(
            id=profile.id,
            first_name=profile.first_name,
            last_name=profile.last_name,
            description=profile.description,
        )

    @classmethod
    def dummy(cls) -> "ProfileOutPublicReduced":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return ProfileOutPublicReduced.model_validate(json["example"])


class UpdateProfile(BaseModel):
    class Settings:
        template = "profiles"


# ----------------------------------------------------------------------------------- #
#                         Authorization Management operations                         #
# ----------------------------------------------------------------------------------- #


class RoleHoldershipInOut(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "profile": ProfileOutPublic.dummy(),
                "role": RoleInOut.dummy(),
            }
        }
    )

    profile: ProfileOutPublic
    role: RoleInOut

    @classmethod
    def from_db_model(
        cls, role_holdership: db_models.RoleHoldership
    ) -> "RoleHoldershipInOut":
        return RoleHoldershipInOut(
            profile=ProfileOutPublic.from_db_model(role_holdership.profile),
            role=RoleInOut.from_db_model(role_holdership.role),
        )

    @classmethod
    def dummy(cls) -> "RoleHoldershipInOut":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return RoleHoldershipInOut.model_validate(json["example"])


class RoleHoldershipUpdateInOut(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "profile_id": 42,
                "role_handle": "invite_members",
                "method": "create",
            }
        }
    )

    profile_id: int
    role_handle: str
    method: Literal["create", "delete"]

    @classmethod
    def from_db_model(
        cls,
        role_holdership: db_models.RoleHoldership,
        method: Literal["create", "delete"],
    ) -> "RoleHoldershipUpdateInOut":
        return RoleHoldershipUpdateInOut(
            profile_id=role_holdership.profile_id,
            role_handle=role_holdership.role_handle,
            method=method,
        )

    @classmethod
    def dummy(cls) -> "RoleHoldershipUpdateInOut":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return RoleHoldershipUpdateInOut.model_validate(json["example"])


# ------------------------------------------------------------------------------------ #
#                      DepartmemtMembership management operations                      #
# ------------------------------------------------------------------------------------ #


class DepartmentMembershipWithShortProfileOut(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": 42,
                "profile": ProfileOutPublicReduced.dummy(),
                "department": DepartmentOut.dummy(),
                "position": "TEAMLEAD",
                "time_from": datetime.now(),
                "time_to": datetime.now(),
            }
        }
    )

    id: int
    profile: ProfileOutPublicReduced
    department: DepartmentOut
    position: str
    time_from: datetime | None = Field(None)
    time_to: datetime | None = Field(None)

    @classmethod
    def from_db_model(
        cls, dm: db_models.DepartmentMembership
    ) -> "DepartmentMembershipWithShortProfileOut":
        return DepartmentMembershipWithShortProfileOut(
            id=dm.id,
            profile=ProfileOutPublicReduced.from_db_model(dm.profile),
            department=DepartmentOut.from_db_model(dm.department),
            position=str(dm.position),
            time_from=datetime.combine(dm.time_from.date(), dm.time_from.time())
            if dm.time_from is not None
            else None,
            time_to=datetime.combine(dm.time_to.date(), dm.time_to.time())
            if dm.time_to is not None
            else None,
        )

    @classmethod
    def dummy(cls) -> "DepartmentMembershipWithShortProfileOut":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return DepartmentMembershipWithShortProfileOut.model_validate(json["example"])


class DepartmentMembership(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": 42,
                "profile": ProfileOutPublicReduced.dummy(),
                "department": DepartmentOut.dummy(),
                "position": "TEAMLEAD",
                "time_from": datetime.now(),
                "time_to": datetime.now(),
            }
        }
    )

    id: int
    profile: ProfileOutPublicReduced
    department: DepartmentOut
    position: str
    time_from: datetime | None = Field(None)
    time_to: datetime | None = Field(None)

    @classmethod
    def from_db_model(
        cls, dm: db_models.DepartmentMembership
    ) -> "DepartmentMembership":
        return DepartmentMembership(
            id=dm.id,
            profile=ProfileOutPublicReduced.from_db_model(dm.profile),
            department=DepartmentOut.from_db_model(dm.department),
            position=str(dm.position),
            time_from=datetime.combine(dm.time_from.date(), dm.time_from.time())
            if dm.time_from is not None
            else None,
            time_to=datetime.combine(dm.time_to.date(), dm.time_to.time())
            if dm.time_to is not None
            else None,
        )

    @classmethod
    def dummy(cls) -> "DepartmentMembership":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return DepartmentMembership.model_validate(json["example"])


class DepartmentMembershipInCreate(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "profile_id": 42,
                "department_handle": "dev",
                "position": "TEAMLEAD",
                "time_from": datetime.now(),
                "time_to": datetime.now(),
            }
        }
    )

    profile_id: int
    department_handle: str
    position: str
    time_from: datetime | None = Field(None)
    time_to: datetime | None = Field(None)

    @classmethod
    def dummy(cls) -> "DepartmentMembershipInCreate":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return DepartmentMembershipInCreate.model_validate(json["example"])


class DepartmentMembershipInUpdate(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": 42,
                "position": "TEAMLEAD",
                "time_from": datetime.now(),
                "time_to": datetime.now(),
            }
        }
    )

    id: int
    position: str
    time_from: datetime | None = Field(None)
    time_to: datetime | None = Field(None)

    @classmethod
    def dummy(cls) -> "DepartmentMembershipInUpdate":
        json = cast(dict[str, Any], cls.model_config.get("json_schema_extra"))
        return DepartmentMembershipInUpdate.model_validate(json["example"])
