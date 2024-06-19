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
import Link from "next/link";
import { Edit } from "lucide-react";
import { DeleteAlertDialog } from "./components/review-altert-dialog";

export type Review = PrismaReview & {
  application: Application;
} & { questionnaire: Questionnaire & { phase: Phase } };

export const columns: ColumnDef<Review>[] = [
  {
    accessorKey: "application.id",
    header: "Application",
  },
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
    cell: ({ row }) => {
      const review = row.original;
      return (
        <div className="mr-4 flex justify-end gap-6">
          <Button size="icon" asChild>
            <Link href={`review/${review.id}`}>
              <Edit />
            </Link>
          </Button>

          <Button size="icon" asChild>
            <div>
              <DeleteAlertDialog
                inputReviewId={review.id}
                inputOpportunityId={review.application.opportunityId}
              />
            </div>
          </Button>
        </div>
      );
    },
  },
];
