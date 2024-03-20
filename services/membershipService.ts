import { DepartmentMembership, type Prisma } from "@prisma/client";
import axios from "axios";

// this function is used to retrieve the profile data from the backend should be always in this format "'profiles' : [{first_name, image, ...}, {...}, ...]"
// if there is a change to the provided profile data you need to update app/members/components/Columns.tsx accordingly

export async function updateMembership(
  departmentId: number,
  data: Prisma.DepartmentMembershipUpdateInput,
) {
  const response = await axios.put(
    `/api/departmentMemberships/${departmentId}`,
    data,
  );
  return response;
}

export async function createMembership(
  data: Prisma.DepartmentMembershipUpdateInput,
) {
  const response = await axios.post(`/api/departmentMemberships`, data);
  return response;
}

export async function getMembership(user_id: string, department_id: string) {
  const response = await axios.get(
    `/api/departmentMemberships/userId/${user_id}/departmentId/${department_id}`,
  );
  return response;
}

export async function getMembershipsByUser(
  userId: string,
): Promise<DepartmentMembership[]> {
  const response = await axios
    .get(`/api/departmentMemberships/userId/${userId}`)
    .then((res) =>
      res.data.map((x: DepartmentMembership) => x as DepartmentMembership),
    );
  return response;
}

export async function deleteMembership(membershipId: number) {
  const response = await axios.delete(
    `/api/departmentMemberships/${membershipId}`,
  );
  return response;
}
