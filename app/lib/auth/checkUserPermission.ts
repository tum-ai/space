import { UserRole } from "@prisma/client";
import axios from "axios";

export async function checkPermission(requiredRole: string[], userId: string) {
  if (!userId) {
    return false;
  }

  const response = await axios
    .get(`/api/roles/${userId}`)
    .then((res) => {
      const data = res.data as UserRole[];
      return data.map((role) => role.name);
    })
    .catch((error) => {
      // console.error(error);
    });

  if (!response) {
    return false;
  }

  for (const role of response) {
    if (requiredRole.some((permission) => role.includes(permission))) {
      return true;
    }
  }

  return false;
}
