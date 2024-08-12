import { SpaceRole } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export type ExtendedColumnDef<TData, TUnknown> = ColumnDef<TData, TUnknown> & {
  label: string;
};

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

export interface ColumnDefs {
  departments: Option[];
  roles: Option[];
  positions: Option[];
}
