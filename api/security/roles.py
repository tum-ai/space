import yaml
from supertokens_python.recipe.userroles.asyncio import create_new_role_or_add_permissions,\
    add_role_to_user, get_permissions_for_role
from supertokens_python.recipe.userroles.interfaces import UnknownRoleError
from main import log


# ---------------------------------------------------------------------------#
async def parse_roles(file_path: str) -> dict:
    """
    Parses a YAML file containing roles and permissions and returns a dictionary of roles and permissions.
    :param file_path: path to the YAML file
    :return: dictionary of roles and permissions.
    Example: {"admin": {"description": "Admin role", "permissions": ["templates.read.all", "templates.write.all"]}}
    """
    try:
        data = yaml.safe_load(open(file_path))
    except FileNotFoundError:
        log.error(f"File {file_path} not found")
        raise ValueError(f"File {file_path} not found")

    roles = {}
    for role_name, role_data in data.items():
        permissions = []

        if 'DESCRIPTION' not in role_data:
            raise ValueError(f"Role {role_name} must have a DESCRIPTION field")

        if 'PERMISSIONS' not in role_data:
            raise ValueError(f"Role {role_name} must have a PERMISSIONS field")

        if role_permissions := role_data['PERMISSIONS'] is None:
            pass
        else:
            for permission in role_permissions:
                for feature, actions in permission.items():
                    for action in actions:
                        for action_name, targets in action.items():
                            for target in targets:
                                permissions.append(f"{feature}.{action_name}.{target}")

        roles[role_name] = {'description': role_data['DESCRIPTION'], 'permissions': permissions}

    return roles


async def create_roles():
    """
    Creates roles for the TUM.ai Space API from a YAML file.
    """
    roles = await parse_roles("security/roles.yaml")

    for role_name, role_data in roles.items():
        if permissions := role_data['permissions'] == []:
            log.warn(f"\"{role_name}\" role has no permissions assigned. It is recommended to assign at least one "
                     f"permission to a role.")

        res = await create_new_role_or_add_permissions(role_name, permissions)
        if not res.created_new_role:
            log.warn(f"\"{role_name}\" role already exists")
        else:
            log.info(f"\"{role_name}\" role created.\nAssigned permissions: {permissions}")


# ---------------------------------------------------------------------------#
async def assign_role_by_user_id(user_id: str, role_name: str):
    """
    Assigns a role to a user by their user ID.
    """
    res = await add_role_to_user(user_id, role_name)
    if isinstance(res, UnknownRoleError):
        log.error("Unknown role error: %s", res)
        raise ValueError(f"Unknown role: {role_name}")
    if res.did_user_already_have_role:
        log.info(f"User {user_id} already had \"user\" role")
    else:
        log.info(f"User {user_id} was assigned \"user\" role. Assigned permissions:"
                 f" {await get_permissions_for_role(role_name)}")
