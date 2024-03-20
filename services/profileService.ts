import { Prisma } from "@prisma/client";
import axios from "axios";


export async function getProfileData() {
  const response = await axios.get("/api/profiles");
  if (response.status !== 200) {
    throw new Error("Failed to fetch profiles");
  }
  return response.data;
}

export async function deleteProfile(id: string) {
  const response = await axios.delete(`/api/profiles/${id}`);
  if (response.status !== 200) {
    throw new Error("Failed to delete profile");
  }
  return response.data.profiles;
}

export async function updateProfile(id: string, data: Prisma.UserUpdateInput) {
  const response = await axios.put(`/api/profiles/${id}`, data);
  if (response.status !== 200) {
    throw new Error("Failed to update profile");
  }
  return response.data.profiles;
}
