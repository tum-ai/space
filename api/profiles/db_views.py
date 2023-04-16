from datetime import datetime

from sqlalchemy import select, func, Engine, text
from sqlalchemy.orm import Session
from sqlalchemy_utils import create_view
from sqlalchemy_utils.view import DropView

from database.db_models import Base
from profiles.db_models import DepartmentMembership, Profile


def init_views(engine: Engine, base_instance):
    init_current_memberships(engine, base_instance)

    # sqlalchemy 1.3:
    # premium_members = select([users]).where(users.c.premium_user == True)
    # create_view('premium_users', premium_members, base_instance)


def init_current_memberships(engine: Engine, base_instance):
    query_stmt = select(DepartmentMembership)\
        .where(
            (DepartmentMembership.time_from <= datetime.now())
            &
            ((DepartmentMembership.time_to >= datetime.now()) | (DepartmentMembership.time_to is None))
        )

    # drop old view
    with engine.connect() as con:
        statement = text("""DROP VIEW IF EXISTS v_memberships_current;""")
        con.execute(statement)
        con.commit()

    # create view if not exists
    view = create_view('v_memberships_current', query_stmt, base_instance.metadata)

    # provides an ORM interface to the view
    class VMembershipsCurrent(base_instance):
        __table__ = view


    # Base.metadata.create_all() done in caller
