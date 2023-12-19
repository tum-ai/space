import * as React from "react"
import {
  ColumnDef,
} from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@components/ui/button"
import { Checkbox } from "@components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu"
import { DataTableColumnHeader} from "./DataTabelHeader" 
import { User } from "prisma/prisma-client"
import { Avatar } from "@components/Avatar"

export const columns: ColumnDef<User>[] = [
    {
      id: "select",
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
      accessorKey: "Image",
      cell: ({ row }) => {
        const profil = row.original

        return (
        <>
        <Avatar
            variant={"circle"}
            profilePicture={profil.image}
            initials={(
              "" +
              row.getValue('first_name')[0] +
              row.getValue('last_name')[0]
            ).toUpperCase()}
          />
        </>
      )},
    },
    {
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Id" />
        ),
        cell: ({ row }) => <div className="lowercase">{row.getValue("id")}</div>,
      },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "first_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="First Name" />
      ),
      cell: ({ row }) => <div className="lowercase">{row.getValue("first_name")}</div>,
    },
    {
        accessorKey: "last_name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Last Name" />
        ),
        cell: ({ row }) => <div className="lowercase">{row.getValue("last_name")}</div>,
      },
      {
        accessorKey: "permission",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Permission" />
        ),
        cell: ({ row }) => <div className="lowercase">{row.getValue("permission")}</div>,
      },
      {
        accessorKey: "departmentname",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Department" />
        ),
        cell: ({ row }) => <div className="lowercase">{row.getValue("departmentname")}</div>,
      },
      {
        accessorKey: "departmentposition",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Position" />
        ),
        cell: ({ row }) => <div className="lowercase">{row.getValue("departmentposition")}</div>,
      },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const profil = row.original
  
        return (
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
                    return
                  }
                  navigator.clipboard.writeText(profil.email)}}
              >
                Copy Email
              </DropdownMenuItem>
              <DropdownMenuItem>View Member</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]