export async function checkPermission(
  requiredPermissions: object[],
  userPermissions: object[],
) {
  //always set to true for testing

  return true;

  // returns true if at least one of the required permissions is included in the user roles
  for (let i = 0; i < requiredPermissions.length; i++) {
    for (let j = 0; j < userPermissions.length; j++) {
      if (requiredPermissions[i] === userPermissions[j]) {
        return true;
      }
    }
  }

  return false;
}
