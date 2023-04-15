import enum
from typing import Optional, List

from sqlalchemy import String, ForeignKey, Column, DateTime, func, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.db_models import Base
from profiles.db_models import MixinAsDict, Profile
from profiles.db_models import Department


class Project(MixinAsDict, Base):
    """database model"""

    __tablename__ = "project"

    # [MANAGED FIELDS] #################################################################################################
    handle: Mapped[str] = mapped_column(String(20), primary_key=True)

    # [USER CHANGEABLE FIELDS] #########################################################################################
    name: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(2048), nullable=True)

    # [RELATIONAL FK FIELDS] ###########################################################################################
    department_handle: Mapped[Optional[str]] = mapped_column(
        ForeignKey("department.handle", ondelete='SET NULL'), nullable=True)
    department: Mapped[Optional["Department"]] = relationship("Department", back_populates="projects")

    # back reference from ProjectMembership
    memberships: Mapped[List["ProjectMembership"]] = relationship(
        "ProjectMembership", back_populates="project")

    # [AUTOMATIC/COMPUTED FIELDS] ######################################################################################
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
    __tablename__ = 'project_membership'

    # [MANAGED FIELDS] #################################################################################################
    profile_id: Mapped[int] = mapped_column(ForeignKey(Profile.id), primary_key=True)
    project_handle: Mapped[str] = mapped_column(ForeignKey(Project.handle), primary_key=True)

    # [SUPERVISOR CHANGEABLE FIELDS] ###################################################################################
    role = Column(Enum(ProjectRole), nullable=False)
    time_from = Column(DateTime, nullable=True)
    time_to = Column(DateTime, nullable=True)

    # [RELATIONAL FK FIELDS] ###########################################################################################
    profile: Mapped["Profile"] = relationship("Profile", back_populates="project_memberships")
    project: Mapped["Project"] = relationship("Project", back_populates="memberships")

    def __repr__(self) -> str:
        return f"ProjectMembership(profile_id={self.profile_id}, project_handle={self.project_handle})"
    __tablename__ = 'project_membership'

    # [MANAGED FIELDS] #################################################################################################
    profile_id: Mapped[int] = mapped_column(ForeignKey(Profile.id), primary_key=True)
    project_handle: Mapped[str] = mapped_column(ForeignKey(Project.handle), primary_key=True)

    # [SUPERVISOR CHANGEABLE FIELDS] ###################################################################################
    role = Column(Enum(ProjectRole), nullable=False)
    time_from = Column(DateTime, nullable=True)
    time_to = Column(DateTime, nullable=True)

    # [RELATIONAL FK FIELDS] ###########################################################################################
    profile: Mapped["Profile"] = relationship("Profile", back_populates="project_memberships")
    project: Mapped["Project"] = relationship("Project", back_populates="memberships")

    def __repr__(self) -> str:
        return f"ProjectMembership(profile_id={self.profile_id}, project_handle={self.project_handle})"
