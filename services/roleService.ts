import axios from "axios";
import { User, Prisma } from "@prisma/client";
import { SpaceRole } from "@prisma/client";

type Option = {
  label: string;
  value: string;
};

export async function addUserRole(userId: string, role: string) {
  try {
    const existingRoles = await getRolesMapForUser(userId);

    if (existingRoles.some((r: Option) => r.value === role)) {
      return null;
    }

    const newRoles = [...existingRoles, { label: role, value: role }];

    const response = await axios.put(`/api/profiles/${userId}`, {
      roles: newRoles.map((role: Option) => role.value),
      updatedAt: new Date(),
    });

    return response;
  } catch (error) {
    console.error("Failed to update user role:", error);
    return null;
  }
}

export async function deleteRole(userId: string, roleToRemove: string) {
  try {
    const existingRoles = await getRolesMapForUser(userId);

    const newRoles = existingRoles.filter(
      (role: Option) => role.value !== roleToRemove,
    );

    const response = await axios.put(`/api/profiles/${userId}`, {
      roles: newRoles.map((role: Option) => role.value),
      updatedAt: new Date(),
    });
    return response;
  } catch (error) {
    console.error("Failed to delete role:", error);
    return null;
  }
}

export async function getRolesMap() {
  const rolesMap = Object.keys(SpaceRole).map((role) => ({
    label: String(
      role.charAt(0).toUpperCase() +
        role.slice(1).toLowerCase().replaceAll("_", " "),
    ),
    value: role,
  }));
  return rolesMap;
}

export async function getRolesMapForUser(id: string) {
  const response = await axios.get(`/api/roles/${id}`);
  if (response.status !== 200) {
    throw new Error("Failed to fetch permissions");
  }
  return response.data.roles.map((role: string) => ({
    label:
      role.charAt(0).toUpperCase() +
      role.slice(1).toLowerCase().replaceAll("_", " "),
    value: role,
  }));
}
