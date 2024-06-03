"use client";

import { DataTableColumnHeader } from "@components/ui/data-table-column-header";
import { RowType } from "./components/DataTableTypes";

import { Button } from "@components/ui/button";
import Link from "next/link";
import { Edit } from "lucide-react";
import { DeleteAlertDialog } from "./components/review-altert-dialog";
import { ExtendedColumnDef } from "./components/DataTableTypes";

export const columns: ExtendedColumnDef<RowType, unknown>[] = [
  {
    accessorKey: "application.id",
    header: "Application",
    label: "Application",
  },
  {
    accessorKey: "user.name",
    header: "Reviewer",
    label: "Reviewer",
  },
  {
    accessorKey: "questionnaire.phase.name",
    header: "Phase",
    label: "Phase",
  },
  {
    accessorKey: "questionnaire.name",
    header: "Questionnaire",
    label: "Questionnaire",
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    label: "Status",
  },
  {
    id: "actions",
    label: "Actions",
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
