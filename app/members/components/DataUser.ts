import { SpaceRole } from "@prisma/client";

export type RowUser = {
  id: string;
  name: string;
  email: string;
  role: SpaceRole[];
  currentDepartment: string;
  currentDepartmentPosition: string;
};
