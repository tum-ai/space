import { UserPermission, DepartmentPosition } from "@prisma/client"; 
import axios from 'axios';

export async function getPermissionsMap() {
    return Object.keys(UserPermission).map((permission) => ({
      label: String(permission[0].toUpperCase() + permission.slice(1)).replaceAll('_', ' '),
      value: permission,
    }));
  }
  
export async function getPositionsMap() {
  return Object.keys(DepartmentPosition).map((position) => ({
    label: String(position[0].toUpperCase() + position.slice(1)).replaceAll('_', ' '),
    value: position,
  }));
}

export async function getDepartmentsMap() {
  try {
    const response = await axios.get('/api/departments');
    if (response.status !== 200) {
      throw new Error('Failed to fetch departments');
    }
    return response.data.departments.map(department => ({
      label: department.name.charAt(0).toUpperCase() + department.name.slice(1).replaceAll('_', ' '),
      value: department.name,
    }));
  } catch (error) {
    throw error;
  }
}

// this function is used to retrieve the profile data from the backend should be always in this format "'profiles' : [{first_name, image, ...}, {...}, ...]"
// if there is a change to the provided profile data you need to update app/members/components/Columns.tsx accordingly
export async function getProfileData() {
  try {
    const response = await axios.get('/api/profiles');
    if (response.status !== 200) {
      throw new Error('Failed to fetch profiles');
    }
    return response.data.profiles;
  } catch (error) {
    throw error;
  }
}



