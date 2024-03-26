import { SpaceRole } from "@prisma/client";

export type Option = {
  label: string | number;
  value: string | number;
};

export type RowUser = {
  id: string;
  name: string;
  email: string;
  image: string | undefined;
  roles: SpaceRole[];
  currentDepartment: string;
  currentDepartmentPosition: string;
};

export type ColumnData = {
  departments: Option[];
  roles: Option[];
  positions: Option[];
};
