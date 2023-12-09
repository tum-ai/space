import { getSession } from "next-auth/react";
import { checkPermission } from "@lib/auth/checkUserPermission";

export async function hasPermission(required_permissions = []) {
  const session = await getSession();
  const userPermission = session?.user?.permission;
  
  return await checkPermission(required_permissions, userPermission);
}