import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { DataTableColumnHeader } from "./DataTabelHeader";
import { SpaceRole, User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { deleteProfile } from "@services/profileService";

// ExtendedColumnDef extends ColumnDef with additional properties for table rendering.
type ExtendedColumnDef<T extends object> = ColumnDef<T> & {
  // 'label' is a human-readable name for the column. It's used instead of 'Header' which is for the header component.
  label: string;
};

export const columns: ExtendedColumnDef<User>[] = [
  {
    id: "select",
    label: "Select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(!value === false)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!value === false)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "image",
    label: "Image",
    header: ({ column }) => (
      <div className="ml-2 mr-2">{column.columnDef.label}</div>
    ),
    cell: ({ row }) => {
      const value: string = row.getValue("image");
      const nameValue: string = row.getValue("name");
      if (value === undefined) {
        console.error("No image found in user");
      }

      if (!nameValue) {
        return;
      }

      return (
        <>
          <Avatar>
            <AvatarImage src={value} />
            <AvatarFallback>
              {nameValue.charAt(0)}
              {nameValue.charAt(1)}
            </AvatarFallback>
          </Avatar>
        </>
      );
    },
  },
  {
    accessorKey: "id",
    label: "Id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.columnDef.label} />
    ),
    cell: ({ row }) => {
      const value: string = row.getValue("id");
      return (
        <div className="lowercase">{value ? value.replace(/_/g, " ") : ""}</div>
      );
    },
  },
  {
    accessorKey: "email",
    label: "Email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.columnDef.label} />
    ),
    cell: ({ row }) => {
      const value: string = row.getValue("email");
      if (value === undefined) {
        console.error("No email found in user");
      }
      return (
        <div className="lowercase">{value ? value.replace(/_/g, " ") : ""}</div>
      );
    },
  },
  {
    accessorKey: "name",
    label: "Name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.columnDef.label} />
    ),
    cell: ({ row }) => {
      const value: string = row.getValue("name");
      if (value === undefined) {
        console.error("No name found in user");
      }
      return (
        <div className="lowercase">{value ? value.replace(/_/g, " ") : ""}</div>
      );
    },
  },
  {
    accessorKey: "roles",
    label: "Roles",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.columnDef.label} />
    ),
    filterFn: (row, id, filterValues) => {
      const aRoles: SpaceRole[] = row.getValue("roles");
      for (let i = 0; i < filterValues.length; i++) {
        const filterValue = filterValues[i].toLowerCase();
        if (!aRoles) {
          return false;
        }
        for (let j = 0; j < aRoles.length; j++) {
          const role = aRoles[j];
          if (String(role).toLowerCase().includes(filterValue)) {
            return true;
          }
        }
      }
      return false;
    },
    cell: ({ row }) => {
      const value: string[] = row.getValue("roles");
      if (value === undefined) {
        console.error("No roles found in user");
      }
      return <div className="lowercase">{value ? value.join(", ") : ""}</div>;
    },
  },
  {
    accessorKey: "currentDepartment",
    label: "Department",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.columnDef.label} />
    ),
    filterFn: (row, id, filterValues) => {
      for (let i = 0; i < filterValues.length; i++) {
        const rowValue = row.getValue("departmentMemberships");

        if (!rowValue) {
          return false;
        }

        const value = rowValue[0].department.id;
        const filterValue = filterValues[i];

        if (rowValue === filterValue) {
          return true;
        }
      }
      return false;
    },
    cell: ({ row }) => {
      const value: string = row.getValue("currentDepartment");
      if (value === undefined) {
        console.error("No department found in user");
      }
      return (
        <div className="lowercase">{value ? value.replace(/_/g, " ") : ""}</div>
      );
    },
  },
  {
    accessorKey: "currentDepartmentPosition",
    label: "Position",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={column.columnDef.label} />
    ),
    filterFn: (row, id, filterValues) => {
      for (let i = 0; i < filterValues.length; i++) {
        const filterValue = filterValues[i].toLowerCase();
        if (
          String(row.getValue("currentDepartmentPosition"))
            .toLowerCase()
            .includes(filterValue)
        ) {
          return true;
        }
      }
      return false;
    },
    cell: ({ row }) => {
      const value: string = row.getValue("currentDepartmentPosition");
      if (value === undefined) {
        console.error("No position found in user");
      }
      return (
        <div className="lowercase">{value ? value.replace(/_/g, " ") : ""}</div>
      );
    },
  },
  {
    id: "actions",
    label: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const profil = row.original;

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  if (!profil.email) {
                    return;
                  }
                  navigator.clipboard.writeText(profil.email);
                }}
              >
                Copy Email
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={true}
                className="disabled text-red-500"
                onClick={async () => {
                  try {
                    // TODO: as long as we dont have a permission system, we should not allow to delete profiles
                    // await deleteProfile(profil.id);
                    window.location.reload();
                    //TODO: Instead of reloading the page, we should update the table in the parent component
                  } catch (error) {
                    throw new Error(error);
                  }
                }}
              >
                Delete Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
