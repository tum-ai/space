from __future__ import (
    annotations,
)

import enum
from datetime import (
    datetime,
)
from typing import (
    List,
    Optional,
)

from dateutil.relativedelta import (
    relativedelta,
)
from pydantic import (
    BaseModel,
)
from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    func,
)
from sqlalchemy.ext.declarative import (
    declarative_base,
)
from sqlalchemy.ext.hybrid import (
    hybrid_property,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

# don't touch this base class!
Base = declarative_base()


class MixinAsDict:
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Department(MixinAsDict, Base):
    """database model"""

    __tablename__ = "department"

    # [MANAGED FIELDS] ###################################################################
    handle: Mapped[str] = mapped_column(String(20), primary_key=True)

    # [USER CHANGEABLE FIELDS] ###########################################################
    name: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(2048), nullable=True)

    # [RELATIONAL FK FIELDS] #############################################################
    # back reference from DepartmentMembership
    memberships: Mapped[List["DepartmentMembership"]] = relationship(
        "DepartmentMembership", back_populates="department"
    )

    # back reference from Project
    projects: Mapped[List["Project"]] = relationship(
        "Project", back_populates="department"
    )

    def __repr__(self) -> str:
        return f"Department(id={self.handle!r}, name={self.name!r})"


class Role(enum.Enum):
    TEAMLEAD = "Teamlead"
    PRESIDENT = "President"
    MEMBER = "Member"
    ALUMNI = "Alumni"
    APPLICANT = "Applicant"


class JobHistoryElement(BaseModel):
    employer: str
    position: str
    date_from: str
    date_to: str

    @classmethod
    def dummy(cls) -> "JobHistoryElement":
        return JobHistoryElement(
            employer="Google",
            position="SWE Intern",
            date_from="15.01.2023",
            date_to="31.03.2023",
        )

    class Config:
        schema_extra = {
            "example": {
                "employer": "Google",
                "position": "SWE Intern",
                "date_from": "15.01.2023",
                "date_to": "31.03.2023",
            }
        }


# TODO: see https://sqlalchemy-imageattach.readthedocs.io/en/0.8.0/api/entity.html
# class UserPicture(Base, Image):
#     '''User's profile picture.'''
#
#     user_id = Column(Integer, ForeignKey('User.id'), primary_key=True)
#     user = relationship('User')
#
#     __tablename__ = 'user_picture'


class Profile(MixinAsDict, Base):
    """database model"""

    __tablename__ = "profile"

    # [MANAGED FIELDS] ###################################################################
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    firebase_uid: Mapped[str] = mapped_column(
        String, unique=True, index=True, nullable=False
    )

    # [USER CHANGEABLE FIELDS] ###########################################################
    email: Mapped[str] = mapped_column(String(200), index=True, nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(50), index=True, nullable=True)

    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)

    birthday = Column(DateTime, nullable=True)
    nationality: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)

    # TODO: see https://sqlalchemy-imageattach.readthedocs.io/en/0.8.0/api/entity.html
    # profile_picture

    activity_status: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    degree_level: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    degree_name: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)
    degree_semester: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    degree_semester_last_change_date = Column(DateTime, nullable=True)
    university: Mapped[Optional[str]] = mapped_column(String(160), nullable=True)

    # format: csv list of <employer:position:from:to>,
    job_history: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    # [SUPERVISOR CHANGEABLE FIELDS] #####################################################
    time_joined = Column(DateTime, nullable=True)

    # [RELATIONAL FK FIELDS] #############################################################
    # back reference from SocialNetwork
    social_networks: Mapped[List["SocialNetwork"]] = relationship(
        "SocialNetwork", back_populates="profile"
    )

    # back reference from DepartmentMembership
    department_memberships: Mapped[List["DepartmentMembership"]] = relationship(
        "DepartmentMembership", back_populates="profile"
    )

    # back reference from ProjectMembership
    project_memberships: Mapped[List["ProjectMembership"]] = relationship(
        "ProjectMembership", back_populates="profile"
    )

    # back reference from CertificationRequest
    certification_requests: Mapped[List["CertificationRequest"]] = relationship(
        "CertificationRequest", back_populates="profile"
    )

    # back reference from Certificate
    received_certificates: Mapped[List["Certificate"]] = relationship(
        "Certificate", back_populates="profile", foreign_keys="Certificate.profile_id"
    )

    # back reference from Certificate
    issued_certificates: Mapped[List["Certificate"]] = relationship(
        "Certificate", back_populates="issuer", foreign_keys="Certificate.issuer_id"
    )

    # [AUTOMATIC/COMPUTED FIELDS] ########################################################
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())

    @hybrid_property
    def tum_ai_semester(self):
        """automatically computed by python from db model"""
        return relativedelta(datetime.now(), self.date_joined).years * 2

    @hybrid_property
    def full_name(self):
        """automatically computed by python from db model"""
        return f"{self.first_name} {self.last_name}"

    @hybrid_property
    def decoded_job_history(self):
        job_history = []
        if job_history and len(job_history) > 0:
            for entry in f"{job_history}".split(","):
                fields = entry.split(":")
                if len(fields) != 4:
                    continue
                job_history.append(
                    JobHistoryElement(
                        employer=fields[0],
                        position=fields[1],
                        date_from=fields[2],
                        date_to=fields[3],
                    )
                )
        return job_history

    def __repr__(self) -> str:
        return f"Profile(id={self.id}, fullname={self.full_name})"

    #
    @classmethod
    def encode_job_history(cls, job_history: JobHistoryElement) -> Optional[str]:
        # encode job_history in csv of <employer:position:from:to>
        encoded_history = ""
        for hist in job_history:
            # TODO abstraction
            encoded_history = (
                f"{encoded_history}{hist.employer}:{hist.position}:"
                + f"{hist.date_from}:{hist.date_to},"
            )
        if len(encoded_history) > 0:
            encoded_history = encoded_history[:-1]  # strip trailing comma
        else:
            encoded_history = None

        return encoded_history


class SocialNetworkType(enum.Enum):
    SLACK = "Slack"
    LINKEDIN = "LinkedIn"
    GITHUB = "GitHub"
    PHONENUMBER = "Phone"
    INSTAGRAM = "Instagram"
    TELEGRAM = "Telegram"
    DISCORD = "Discord"
    OTHER = "Other"


class SocialNetwork(MixinAsDict, Base):
    """database model"""

    __tablename__ = "social_network"

    # [MANAGED FIELDS] ###################################################################
    profile_id: Mapped[int] = mapped_column(
        ForeignKey(Profile.id, ondelete="CASCADE"), primary_key=True
    )
    type = Column(Enum(SocialNetworkType), primary_key=True)

    # [USER CHANGEABLE FIELDS] ###########################################################
    handle: Mapped[Optional[str]] = mapped_column(String(40), nullable=True)
    link: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)

    # [RELATIONAL FK FIELDS] #############################################################
    profile: Mapped["Profile"] = relationship(
        "Profile", back_populates="social_networks", cascade="all,delete"
    )

    __table_args__ = (
        (CheckConstraint("(handle IS NULL) <> (link IS NULL)", name="handle_xor_link")),
    )

    def __repr__(self) -> str:
        return (
            f"SocialNetwork(profile_id={self.profile_id!r}, type={self.type!r}, "
            f"fullname={self.handle!r}, link={self.link!r})"
        )


class DepartmentMembership(MixinAsDict, Base):
    """database relation"""

    __tablename__ = "department_membership"

    # [MANAGED FIELDS] ###################################################################
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    # [SUPERVISOR CHANGEABLE FIELDS] #####################################################
    role = Column(Enum(Role), nullable=False)
    time_from = Column(DateTime, nullable=True)
    time_to = Column(DateTime, nullable=True)

    # [RELATIONAL FK FIELDS] #############################################################
    profile_id: Mapped[int] = mapped_column(
        ForeignKey(Profile.id, ondelete="CASCADE"), nullable=False
    )
    profile: Mapped["Profile"] = relationship(
        "Profile", back_populates="department_memberships", cascade="all,delete"
    )

    department_handle: Mapped[str] = mapped_column(
        ForeignKey(Department.handle), nullable=False
    )
    department: Mapped["Department"] = relationship(
        "Department", back_populates="memberships"
    )

    def __repr__(self) -> str:
        return (
            f"DepartmentMembership(id={self.profile_id!r} "
            + f"({self.profile.full_name}), department_handle={self.department_handle!r})"
        )


class Project(MixinAsDict, Base):
    """database model"""

    __tablename__ = "project"

    # [MANAGED FIELDS] ###################################################################
    handle: Mapped[str] = mapped_column(String(20), primary_key=True)

    # [USER CHANGEABLE FIELDS] ###########################################################
    name: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(2048), nullable=True)

    # [RELATIONAL FK FIELDS] #############################################################
    department_handle: Mapped[Optional[str]] = mapped_column(
        ForeignKey("department.handle", ondelete="SET NULL"), nullable=True
    )
    department: Mapped[Optional["Department"]] = relationship(
        "Department", back_populates="projects"
    )

    # back reference from ProjectMembership
    memberships: Mapped[List["ProjectMembership"]] = relationship(
        "ProjectMembership", back_populates="project"
    )

    # [AUTOMATIC/COMPUTED FIELDS] ########################################################
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self) -> str:
        return f"Project(handle={self.handle!r}, name={self.name!r})"


class ProjectRole(enum.Enum):
    CLIENT = "Client"
    LEAD = "ProjectLead"
    PM = "ProductManager"
    MEMBER = "Member"


class ProjectMembership(MixinAsDict, Base):
    """database relation"""

    __tablename__ = "project_membership"

    # [MANAGED FIELDS] ###################################################################
    profile_id: Mapped[int] = mapped_column(ForeignKey(Profile.id), primary_key=True)
    project_handle: Mapped[str] = mapped_column(
        ForeignKey(Project.handle), primary_key=True
    )

    # [SUPERVISOR CHANGEABLE FIELDS] #####################################################
    role = Column(Enum(ProjectRole), nullable=False)
    time_from = Column(DateTime, nullable=True)
    time_to = Column(DateTime, nullable=True)

    # [RELATIONAL FK FIELDS] #############################################################
    profile: Mapped["Profile"] = relationship(
        "Profile", back_populates="project_memberships"
    )
    project: Mapped["Project"] = relationship("Project", back_populates="memberships")

    def __repr__(self) -> str:
        return (
            f"ProjectMembership(profile_id={self.profile_id}, "
            + +f"project_handle={self.project_handle})"
        )


class CertificationTemplate(MixinAsDict, Base):
    """database model"""

    __tablename__ = "certification_template"

    # [MANAGED FIELDS] ###################################################################
    handle: Mapped[str] = mapped_column(String(20), primary_key=True)

    # [USER CHANGEABLE FIELDS] ###########################################################
    # types: short, long, number
    # e.g. "name:short,description:long,prize:short"
    csv_replacors_with_types: Mapped[str] = mapped_column(String, nullable=False)

    # [RELATIONAL FK FIELDS] #############################################################
    # back reference from CertificationRequest
    requests: Mapped[List["CertificationRequest"]] = relationship(
        "CertificationRequest", back_populates="template"
    )

    # back reference from Certificate
    certificates: Mapped[List["Certificate"]] = relationship(
        "Certificate", back_populates="template"
    )

    def __repr__(self) -> str:
        return f"CertificationTemplate(id={self.handle})"


class CertificationRequest(MixinAsDict, Base):
    """database model"""

    __tablename__ = "certification_requests"

    # [MANAGED FIELDS] ###################################################################
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # [CONST FIELDS] #####################################################################
    csv_replacors_values: Mapped[str] = mapped_column(String, nullable=True)

    # [RELATIONAL FK FIELDS] #############################################################
    profile_id: Mapped[int] = mapped_column(ForeignKey(Profile.id), nullable=False)
    profile: Mapped["Profile"] = relationship(
        "Profile", back_populates="certification_requests"
    )

    template_handle: Mapped[str] = mapped_column(
        ForeignKey(CertificationTemplate.handle), nullable=False
    )
    template: Mapped["CertificationTemplate"] = relationship(
        "CertificationTemplate", back_populates="requests"
    )

    # back reference from CertificationFeedback
    feedback: Mapped[List["CertificationFeedback"]] = relationship(
        "CertificationFeedback", back_populates="request"
    )

    # back reference from Certificate
    certificate: Mapped["Certificate"] = relationship(
        "Certificate", back_populates="request"
    )

    # [AUTOMATIC/COMPUTED FIELDS] ########################################################
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self) -> str:
        return f"CertificationRequest(id={self.handle!r}, name={self.name!r})"


class CertificationFeedback(MixinAsDict, Base):
    """database model"""

    __tablename__ = "certification_feedback"

    # [MANAGED FIELDS] ###################################################################
    request_id: Mapped[int] = mapped_column(
        ForeignKey(CertificationRequest.id, ondelete="SET NULL"), primary_key=True
    )
    approver_id: Mapped[int] = mapped_column(
        ForeignKey(Profile.id, ondelete="SET NULL"), primary_key=True
    )

    # [USER CHANGEABLE FIELDS] ###########################################################
    approved: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    feedback_text: Mapped[str] = mapped_column(String(400))
    csv_replacors_values: Mapped[str] = mapped_column(String, nullable=True)

    # [RELATIONAL FK FIELDS] #############################################################
    request: Mapped["CertificationRequest"] = relationship(
        "CertificationRequest", back_populates="feedback"
    )
    approver: Mapped["Profile"] = relationship("Profile")

    __table_args__ = (
        (
            CheckConstraint(
                "(approved) <> (NOT csv_replacors_values IS NULL)",
                name="handle_xor_link",
            )
        ),
    )

    # [AUTOMATIC/COMPUTED FIELDS] ########################################################
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self) -> str:
        return (
            f"CertificationFeedback(request_id={self.request_id}, "
            f"approver_id={self.approver_id}, "
            f"approved={self.approved})"
        )


class Certificate(MixinAsDict, Base):
    """database model"""

    __tablename__ = "certificate"

    # [MANAGED FIELDS] ###################################################################
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    # [CONST FIELDS] #####################################################################
    csv_replacors_values: Mapped[str] = mapped_column(String, nullable=True)
    cdn_download_link: Mapped[str] = mapped_column(String(2048), nullable=False)
    cdn_expiry = Column(DateTime(timezone=True), nullable=False)

    # [RELATIONAL FK FIELDS] #############################################################
    profile_id: Mapped[int] = mapped_column(
        ForeignKey(Profile.id, ondelete="CASCADE"), nullable=False
    )
    profile: Mapped["Profile"] = relationship(
        "Profile", back_populates="received_certificates", foreign_keys=[profile_id]
    )

    issuer_id: Mapped[int] = mapped_column(
        ForeignKey(Profile.id, ondelete="SET NULL"), nullable=True
    )
    issuer: Mapped["Profile"] = relationship(
        "Profile", back_populates="issued_certificates", foreign_keys=[issuer_id]
    )

    template_handle: Mapped[str] = mapped_column(
        ForeignKey(CertificationTemplate.handle, ondelete="SET NULL"), nullable=False
    )
    template: Mapped["CertificationTemplate"] = relationship(
        "CertificationTemplate", back_populates="certificates"
    )

    request_id: Mapped[int] = mapped_column(
        ForeignKey(CertificationRequest.id, ondelete="SET NULL"), nullable=True
    )
    request: Mapped["CertificationRequest"] = relationship(
        "CertificationRequest", back_populates="certificate"
    )

    # [AUTOMATIC/COMPUTED FIELDS] ########################################################
    time_created = Column(DateTime(timezone=True), server_default=func.now())
    time_updated = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self) -> str:
        return (
            f"Certificate(id={self.id}, profile_id={self.profile_id}, "
            f"issuer_id={self.issuer_id}, template_handle={self.template_handle}, "
            f"request_id={self.request_id})"
        )
