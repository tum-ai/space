from typing import List, Optional
from datetime import datetime
from dateutil.relativedelta import relativedelta

from pydantic import BaseModel
from pydantic.fields import Field
from pydantic_computed import Computed, computed

from beanie import Document, PydanticObjectId
from enum import Enum


class Department(Enum):
    DEV = "Software Development"
    IND = "Industry"
    PNS = "Partners & Sponsors"
    LNF = "Legal & Finance"
    EDU = "Education"
    COM = "Community"
    VEN = "Venture"
    MAK = "Makeathon"
    MAR = "Marketing"


class Role(Enum):
    TEAMLEAD = "Teamlead"
    PRESIDENT = "President"
    MEMBER = "Member"
    ALUMNI = "Alumni"
    APPLICANT = "Applicant"


class SocialNetwork(BaseModel):
    class SocialNetworkType(Enum):
        SLACK = "Slack"
        LINKEDIN = "LinkedIn"
        GITHUB = "GitHub"
        PHONENUMBER = "Phone"
        INSTAGRAM = "Instagram"
        TELEGRAM = "Telegram"
        DISCORD = "Discord"
        OTHER = "Other"

    type: SocialNetworkType
    link: str


class Profile(Document):
    # TODO decide if a handle would be appropriate
    # TODO include activity status?
    name: str
    # TODO encode
    # picture: Image
    description: str

    degreeLevel: str
    degreeName: str
    degreeSemester: int
    university: str
    currentJob: str

    department: Department
    role: Role
    previousDepartments: List[Department]
    joinedBatch: datetime
    # TODO later List[Projects] or List[projectIDs]
    involvedProjects: List[str]
    # TODO enum?
    nationality: str
    socialNetworks: List[SocialNetwork]

    tumaiSemester: Computed[int]

    @computed("tumaiSemester")
    def compute_tumai_semester(**attrs) -> int:
        return relativedelta(datetime.now(), attrs["joinedBatch"]).years * 2

    class Config:
        schema_extra = {
            "example": {
                "name": "TUM.ai Example Member",
                "description": "This is an example profile",
                "degreeLevel": "Bachelors",
                "degreeName": "Computer Science",
                "degreeSemester": 3,
                "university": "TUM",
                "currentJob": "AppliedAI AI Engineer",
                "department": Department.DEV,
                "role": Role.TEAMLEAD,
                "previousDepartments": [Department.IND],
                "joinedBatch": datetime(2022, 1, 1),
                "involvedProjects": ["TUM.ai Space"],
                "nationality": "International",
                "socialNetworks": [SocialNetwork(
                    type=SocialNetwork.SocialNetworkType.OTHER,
                    link="other"
                )]
            }
        }

    class Settings:
        name = "profiles"


class UpdateProfile(Document):
    name: str
    # TODO
    # picture: Image
    description: Optional[str]

    degreeLevel: Optional[str]
    degreeName: Optional[str]
    degreeSemester: Optional[int]
    university: Optional[str]
    currentJob: Optional[str]

    department: Optional[Department]
    role: Optional[Role]
    previousDepartments: Optional[List[Department]]
    joinedBatch: Optional[datetime]
    involvedProjects: Optional[List[str]]
    nationality: Optional[str]
    socialNetworks: Optional[List[SocialNetwork]]

    class Settings:
        template = "profiles"


# Profile with information that should be publically available
# Will be projected from Profile
class PublicProfile(BaseModel):
    # parse automatically generated id
    id: PydanticObjectId = Field(..., alias='_id')

    name: str
    # TODO
    # picture: Image
    description: str
    department: Department
    role: Role

    class Config:
        schema_extra = {
            "example": {
                "name": "TUM.ai Example PublicProfile",
                "description": "Description of a PublicProfile",
                "department": Department.COM,
                "role": Role.MEMBER,
            }
        }
