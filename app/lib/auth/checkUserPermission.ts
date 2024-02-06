import { UserRole } from "@prisma/client";
import axios from "axios";
import Axios from "axios";
import { env } from "app/env.mjs";

export async function checkPermission(requiredRole: string[], userId: string) {
  Axios.defaults.baseURL = env.NEXT_PUBLIC_API_URL;
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

  if (requiredRole.some((role) => response.includes(role))) {
    return true;
  }

  return false;
}
