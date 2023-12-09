import { getSession } from "next-auth/react";

//if added more permissions, add them here but be aware of the order of the enum higher permissions should be higher in the enum
enum Permissions {
  admin = "admin",
  user = "user"
}

export async function hasPermission(required_permissions = []) {
  const session = await getSession();
  
  // if the user is not logged in

  if (required_permissions.length < 1) {
    return true;
  }
  
  if (!session) { 
    return false;
  }
  const userPermission = session.user.permission;
  
  //wait for the session to be loaded
  if (!userPermission) return false;

  // check if the user_permission is not known
  if (Permissions[userPermission] === undefined) {
    return false;
  }

  // check if the user has at least one required_permissions or higher
  for (const required of required_permissions) {
    if (Permissions[userPermission] <= Permissions[required]) {
      return true;
    }
  }

  return false;
}