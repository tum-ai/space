import { SpaceRole } from "@prisma/client";

export interface Option {
  label: string | number;
  value: string | number;
}

export interface RowUser {
  id: string;
  name: string;
  email: string;
  image: string | undefined;
  roles: SpaceRole[];
  currentDepartment: string;
  currentDepartmentPosition: string;
}

export interface ColumnData {
  departments: Option[];
  roles: Option[];
  positions: Option[];
}
