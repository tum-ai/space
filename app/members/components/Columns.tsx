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
import { SpaceRole } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { RowUser } from "./DataTableTypes";

export type ExtendedColumnDef<TData, TUnknown> = ColumnDef<TData, TUnknown> & {
  label: string;
};

export const columns: ExtendedColumnDef<RowUser, unknown>[] = [
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
      <div className="ml-2 mr-2">
        {(column.columnDef as ExtendedColumnDef<RowUser, unknown>).label}
      </div>
    ),
    cell: ({ row }) => {
      const value: string = row.getValue("image");
      const nameValue: string = row.getValue("name");

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
      <DataTableColumnHeader
        column={column}
        title={(column.columnDef as ExtendedColumnDef<RowUser, unknown>).label}
      />
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
      <DataTableColumnHeader
        column={column}
        title={(column.columnDef as ExtendedColumnDef<RowUser, unknown>).label}
      />
    ),
    cell: ({ row }) => {
      const value: string = row.getValue("email");
      return (
        <div className="lowercase">{value ? value.replace(/_/g, " ") : ""}</div>
      );
    },
  },
  {
    accessorKey: "name",
    label: "Name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={(column.columnDef as ExtendedColumnDef<RowUser, unknown>).label}
      />
    ),
    cell: ({ row }) => {
      const value: string = row.getValue("name");
      return (
        <div className="lowercase">{value ? value.replace(/_/g, " ") : ""}</div>
      );
    },
  },
  {
    accessorKey: "roles",
    label: "Roles",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={(column.columnDef as ExtendedColumnDef<RowUser, unknown>).label}
      />
    ),
    filterFn: (row, id, filterValues: string[]) => {
      const aRoles: SpaceRole[] = row.getValue("roles");
      for (const filterValue of filterValues) {
        const lowercaseFilterValue: string = filterValue.toLowerCase();
        if (!aRoles) {
          return false;
        }
        for (const role of aRoles) {
          if (String(role).toLowerCase().includes(lowercaseFilterValue)) {
            return true;
          }
        }
      }
      return false;
    },
    cell: ({ row }) => {
      const value: string[] = row.getValue("roles");
      return <div className="lowercase">{value ? value.join(", ") : ""}</div>;
    },
  },
  {
    accessorKey: "currentDepartment",
    label: "Department",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={(column.columnDef as ExtendedColumnDef<RowUser, unknown>).label}
      />
    ),
    filterFn: (row, id, filterValues) => {
      for (const filterValue of filterValues) {
        const rowValue = row.getValue("currentDepartment");

        if (!rowValue) {
          return false;
        }

        if (rowValue === filterValue) {
          return true;
        }
      }
      return false;
    },
    cell: ({ row }) => {
      const value: string = row.getValue("currentDepartment");
      return (
        <div className="lowercase">{value ? value.replace(/_/g, " ") : ""}</div>
      );
    },
  },
  {
    accessorKey: "currentDepartmentPosition",
    label: "Position",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={(column.columnDef as ExtendedColumnDef<RowUser, unknown>).label}
      />
    ),
    filterFn: (row, id, filterValues: string[]) => {
      for (const filterValue of filterValues) {
        if (
          String(row.getValue("currentDepartmentPosition"))
            .toLowerCase()
            .includes(filterValue.toLowerCase())
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
                  navigator.clipboard.writeText(profil.email).catch((error) => {
                    console.error("Error copying email:", error);
                  });
                }}
              >
                Copy Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
