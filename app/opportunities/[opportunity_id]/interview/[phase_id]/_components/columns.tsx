"use client";

import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, UserCheck, UserX } from "lucide-react";
import { type PhaseApplication } from "../page";
import { Badge } from "@components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip";
import Link from "next/link";
import { Avatar, AvatarImage } from "@components/ui/avatar";

export const columns: ColumnDef<PhaseApplication>[] = [
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
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "inPhase",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Invited
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      if (row.getValue("inPhase"))
        return (
          <Badge variant="default">
            <UserCheck className="mr-2" />
            Invited
          </Badge>
        );

      return (
        <Badge variant="outline">
          <UserX className="mr-2" />
          Not invited
        </Badge>
      );
    },
  },
  {
    id: "questionnaires",
    header: "Questionnaires",
    cell: ({ row }) => {
      const questionnaires = row.original.questionnaires;
      return (
        <div className="flex gap-2">
          {questionnaires.map((questionnaire) => (
            <Badge
              key={questionnaire.id}
              variant={questionnaire.phase.isCurrent ? "default" : "outline"}
            >
              {questionnaire.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "reviews",
    header: () => "Reviews",
    cell: ({ row }) => {
      return (
        <div className="flex -space-x-3 overflow-hidden">
          {row.original.reviews.map((review, i) => (
            <Tooltip key={i}>
              <TooltipTrigger>
                <Link href={`../review/${review.id}`}>
                  <Avatar className="border">
                    <AvatarImage src={review.user.image ?? undefined} />
                  </Avatar>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{review.user.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const application = row.original;

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
            <DropdownMenuItem>Copy payment ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
