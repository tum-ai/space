"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@components/ui/data-table-column-header";
import {
  Application,
  Questionnaire,
  Review as PrismaReview,
  Phase,
} from "@prisma/client";
import { Button } from "@components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";

export type Review = PrismaReview & {
  application: Application;
} & { questionnaire: Questionnaire & { phase: Phase } };

export const columns: ColumnDef<Review>[] = [
  {
    accessorKey: "questionnaire.phase.name",
    header: "Phase",
  },
  {
    accessorKey: "questionnaire.name",
    header: "Questionnaire",
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
  {
    id: "actions",
    header: "edit",
    cell: ({ row }) => {
      const review = row.original;

      return (
        <Button size="icon" asChild>
          <Link href={`review/${review.id}`}>
            <Edit />
          </Link>
        </Button>
      );
    },
  },
];
