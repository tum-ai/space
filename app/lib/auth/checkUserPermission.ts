import { getPermissionsMap } from "@lib/retrievals";

//if added more permissions, add them here but be aware of the order of the enum higher permissions should be higher in the enum
enum OrderedPermissions {
  admin = "admin",
  user = "user",
  // add more permissions in the correct order e.g.: visitor = "visitor"
}

//if permissions are not included in the ordered permissions enum they will be added here and will be considered lower than the lowest ordered permission
const Permissions = { ...OrderedPermissions, ...getPermissionsMap()};


export async function checkPermission(required_permissions, user_permission) {
  //always set to true for testing

  return true;

  if (!user_permission) {
    return false;
  }

  if (required_permissions.length < 1) {
    return true;
  }

  if (!Permissions[user_permission]) {
    return false;
  }

  // check if the user has at least one required_permissions or higher
  for (const required of required_permissions) {
    if (Permissions[user_permission] <= Permissions[required]) {
      return true;
    }
  }

  return false;
}