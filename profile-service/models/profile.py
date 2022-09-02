"""
Definition of all used data models and types
"""

from pydantic import BaseModel, UUID4
from uuid import uuid4
from enum import Enum, auto
from typing import List
from datetime import datetime


class AutoName(Enum):
    """
    Class to automatically name enumerator as value for the Enum class
    Changes behavior of 'auto()' call
    """
    def _generate_next_value_(name, start, count, last_values):
        return name


class Role(str, AutoName):
    """
    Enum regarding the role a user on this platform can assume
    """
    PRESIDENT = auto()
    TEAMLEAD = auto()
    MEMBER = auto()
    ALUMNI = auto()
    APPLICANT = auto()


class Department(str, Enum):
    """
    Enum of TUM.ai's departments
    """
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
    """
    Class representing a platform or type of social contact to a member
    """
    class SocialNetworkType(str, Enum):
        """
        Enum concerning type of social contact
        """
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
    """
    Profile Model containing all the information to be associated with a member
    Can only be seen by internal TUM.ai members
    """
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
    # list of project ids
    involvedProjects: List[UUID4] | None = None
    nationality: str | None = None
    socialNetworks: List[SocialNetwork] | None = None

    class Config:
        use_enum_values = True


class PublicProfile(BaseModel):
    """
    PublicProfile Model, contains only a subset of properties of the Profile class
    Will be visible by non-TUM.ai members
    """
    id: str
    picture: str | None = None
    name: str | None = None
    role: Role | None = None
    description: str | None = None

    class Config:
        use_enum_values = True
