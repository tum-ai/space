import { Department, DepartmentRole } from "@prisma/client";
import axios from "axios";

export async function getDepartmentsMap() {
  const response = await axios.get("/api/departments");
  if (response.status !== 200) {
    throw new Error("Failed to fetch departments");
  }
  return response.data.departments.map((department: Department) => ({
    label:
      department.name.charAt(0).toUpperCase() +
      department.name.slice(1).replaceAll("_", " "),
    value: department.id,
  }));
}

export async function getPositionsMap() {
  return Object.keys(DepartmentRole).map((position) => ({
    label: String(
      position.charAt(0).toUpperCase() +
        position.slice(1).toLowerCase().replaceAll("_", " "),
    ),
    value: position,
  }));
}
