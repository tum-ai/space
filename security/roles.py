from supertokens_python.recipe.userroles.asyncio import create_new_role_or_add_permissions, add_role_to_user
from supertokens_python.recipe.userroles.interfaces import UnknownRoleError
from main import log


# ---------------------------------------------------------------------------#
# TODO: define roles and permissions
async def create_admin_role():
    res = await create_new_role_or_add_permissions("admin", ["templates.read.all", "templates.write.all"])
    if not res.created_new_role:
        log.warn("\"admin\" role already exists")
    else:
        log.info("\"admin\" role created")


async def create_generic_user_role():
    res = await create_new_role_or_add_permissions("user", ["templates.read.all"])
    if not res.created_new_role:
        log.warn("\"user\" role already exists")
    else:
        log.info("\"user\" role created")


# ---------------------------------------------------------------------------#
async def assign_user_role(user_id: str):
    """
    Assigns a "user" role to a user.
    """
    res = await add_role_to_user(user_id, "user")
    if isinstance(res, UnknownRoleError):
        log.error("Unknown role error: %s", res)
        return
    if res.did_user_already_have_role:
        log.info(f"User {user_id} already had \"user\" role")
    else:
        log.info(f"User {user_id} was assigned \"user\" role")
