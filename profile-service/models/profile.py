from pydantic import BaseModel, UUID4
from uuid import uuid4
from enum import Enum, auto
from typing import List
from datetime import datetime


class AutoName(Enum):
    def _generate_next_value_(name, start, count, last_values):
        return name


class Role(str, AutoName):
    PRESIDENT = auto()
    TEAMLEAD = auto()
    MEMBER = auto()
    ALUMNI = auto()
    APPLICANT = auto()


class Department(str, Enum):
    DEV = auto()
    IND = auto()
    PNS = auto()
    LNF = auto()
    EDU = auto()
    COM = auto()
    VEN = auto()
    MAK = auto()
    MAR = auto()


class SocialNetwork:
    class SocialNetworkType(str, Enum):
        SLACK = auto()
        LINKEDIN = auto()
        GITHUB = auto()
        PHONE = auto()
        INSTAGRAM = auto()
        TELEGRAM = auto()
        DISCORD = auto()
        OTHER = auto()

    type: SocialNetworkType
    link: str


class Profile(BaseModel):
    id: str
    username: str | None = None
    picture: str | None = None
    description: str | None = None
    degreeName: str | None = None
    degreeSemester: int | None = None
    university: str | None = None
    currentJob: str | None = None
    tumaiSemester: int | None = None
    department: str | None = None
    role: Role | None = None
    previousDepartments: List[Department] | None = None
    joinedBatch: datetime | None = None
    involvedProjects: List[UUID4] | None = None
    nationality: str | None = None
    socialNetworks: List[SocialNetwork] | None = None

    class Config:
        use_enum_values = True


class PublicProfile(BaseModel):
    id: str
    picture: str | None = None
    name: str | None = None
    role: Role | None = None
    description: str | None = None

    class Config:
        use_enum_values = True
