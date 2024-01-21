import { DepartmentPosition } from "@prisma/client";
import axios from "axios";

export async function getRolesMap() {
  try {
    const response = await axios.get("/api/roles");
    if (response.status !== 200) {
      throw new Error("Failed to fetch permissions");
    }
    return response.data.roles.map((role) => ({
      label:
        role.name.charAt(0).toUpperCase() +
        role.name.slice(1).replaceAll("_", " "),
      value: role.name,
    }));
  } catch (error) {
    // throw new Error(error);
  }
}

export async function getRolesMapForUser(id: string) {
  try {
    const response = await axios.get(`/api/roles/${id}`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch permissions");
    }
    return response.data.map((role) => ({
      label:
        role.name.charAt(0).toUpperCase() +
        role.name.slice(1).replaceAll("_", " "),
      value: role.name,
    }));
  } catch (error) {
    throw new Error(error);
  }
}

export async function getPositionsMap() {
  return Object.keys(DepartmentPosition).map((position) => ({
    label: String(
      position[0].toUpperCase() + position.slice(1).toLowerCase(),
    ).replaceAll("_", " "),
    value: position,
  }));
}

export async function getDepartmentsMap() {
  try {
    const response = await axios.get("/api/departments");
    if (response.status !== 200) {
      throw new Error("Failed to fetch departments");
    }
    return response.data.departments.map((department) => ({
      label:
        department.name.charAt(0).toUpperCase() +
        department.name.slice(1).replaceAll("_", " "),
      value: department.name,
    }));
  } catch (error) {
    throw new Error(error);
  }
}

// this function is used to retrieve the profile data from the backend should be always in this format "'profiles' : [{first_name, image, ...}, {...}, ...]"
// if there is a change to the provided profile data you need to update app/members/components/Columns.tsx accordingly
export async function getProfileData() {
  try {
    const response = await axios.get("/api/profiles");
    if (response.status !== 200) {
      throw new Error("Failed to fetch profiles");
    }
    return response.data.profiles;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteProfile(id: string) {
  try {
    const response = await axios.delete(`/api/profiles?id=${id}`);
    if (response.status !== 200) {
      throw new Error("Failed to delete profile");
    }
    return response.data.profiles;
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateMembership(user_id: string, data: object) {
  try {
    let response = await axios.put(
      `/api/departmentMemberships/${user_id}`,
      data,
    );
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createMembership(
  user_id: string,
  department_id: string,
  data: object,
) {
  try {
    const response = await axios.post(
      `/api/departmentMemberships/${user_id}/${department_id}`,
      data,
    );
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
