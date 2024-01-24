import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { DataTableColumnHeader } from "./DataTabelHeader";
import { User, UserRole } from "@prisma/client";
import { Avatar } from "@components/Avatar";
import { deleteProfile } from "@lib/retrievals";

// ExtendedColumnDef extends ColumnDef with additional properties for table rendering.
type ExtendedColumnDef<T extends object> = ColumnDef<T> & {
  // 'label' is a human-readable name for the column. It's used instead of 'Header' which is for the header component.
  label: string;
  options?: () => Promise<Map<string, string>>;
};

export const columns: ExtendedColumnDef<User>[] = [
  {
    id: "select",
    label: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
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
      <div className="ml-2 mr-2">{column.columnDef["label"]}</div>
    ),
    cell: ({ row }) => {
      const profil = row.original;

      return (
        <>
          <Avatar
            variant={"circle"}
            profilePicture={profil.image}
            initials={(
              "" +
              row.getValue("firstName")[0] +
              row.getValue("lastName")[0]
            ).toUpperCase()}
          />
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
        title={column.columnDef["label"]}
      />
    ),
    cell: ({ row }) => {
      const value = row.getValue("id") as string;
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
        title={column.columnDef["label"]}
      />
    ),
    cell: ({ row }) => {
      const value = row.getValue("email") as string;
      return (
        <div className="lowercase">{value ? value.replace(/_/g, " ") : ""}</div>
      );
    },
  },
  {
    accessorKey: "firstName",
    label: "First Name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={column.columnDef["label"]}
      />
    ),
    cell: ({ row }) => {
      const value = row.getValue("firstName") as string;
      return (
        <div className="lowercase">{value ? value.replace(/_/g, " ") : ""}</div>
      );
    },
  },
  {
    accessorKey: "lastName",
    label: "Last Name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={column.columnDef["label"]}
      />
    ),
    cell: ({ row }) => {
      const value = row.getValue("lastName") as string;
      return (
        <div className="lowercase">{value ? value.replace(/_/g, " ") : ""}</div>
      );
    },
  },
  {
    accessorKey: "userRoles",
    label: "Roles",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={column.columnDef["label"]}
      />
    ),
    filterFn: (row, id, filterValues) => {
      const aRoles: UserRole[] = row.original["userToUserRoles"].map(row => row.role);
      for (let i = 0; i < filterValues.length; i++) {
        const filterValue = filterValues[i].toLowerCase();
        if (!aRoles) {
          return false;
        }
        for (let j = 0; j < aRoles.length; j++) {
          const role = aRoles[j];
          if (String(role.name).toLowerCase().includes(filterValue)) {
            return true;
          }
        }
      }
      return false;
    },
    cell: ({ row }) => {
      const user = row.original;
      const roleNames = user["userToUserRoles"].map((role) => {
        return role.role.name;
      });
      const value = roleNames.join(", ");
      return (
        <div className="lowercase">{value ? value.replace(/_/g, " ") : ""}</div>
      );
    },
  },
  {
    accessorKey: "currentDepartment",
    label: "Department",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={column.columnDef["label"]}
      />
    ),
    filterFn: (row, id, filterValues) => {
      for (let i = 0; i < filterValues.length; i++) {
        const filterValue = filterValues[i].toLowerCase();
        if (!row.getValue(id)) {
          return false;
        }
        if (String(row.getValue(id)).toLowerCase().includes(filterValue)) {
          return true;
        }
      }
      return false;
    },
    cell: ({ row }) => {
      const value = row.getValue("currentDepartment") as string;
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
        title={column.columnDef["label"]}
      />
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
      const value = row.getValue("currentDepartmentPosition") as string;
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
                className="text-red-500"
                onClick={async () => {
                  try {
                    await deleteProfile(profil.id);
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
