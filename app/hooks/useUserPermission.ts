import { getSession } from "next-auth/react";
import { checkPermission } from "@lib/auth/checkUserPermission";

export async function hasPermission(requiredPermissions = []) {
  const session = await getSession();
  // TODO: will always return undefined because the session is not setup yet
  const userPermissions = session?.user["permissions"];

  return await checkPermission(requiredPermissions, userPermissions);
}
