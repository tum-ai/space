"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@components/ui/data-table-column-header";
import {
  type Application,
  type Questionnaire,
  type Review as PrismaReview,
  type Phase,
} from "@prisma/client";

import { Button } from "@components/ui/button";
import Link from "next/link";
import { CheckCircle, Clock, Edit, PlusCircle, Trash } from "lucide-react";
import { DeleteAlertDialog } from "./components/review-altert-dialog";
import { Badge } from "@components/ui/badge";

export type Review = PrismaReview & {
  application: Application;
} & { questionnaire: Questionnaire & { phase: Phase } };

const StatusBadge = ({ status }: { status: Review["status"] }) => {
  const colorClass = {
    CREATED: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    DONE: "bg-green-100 text-green-800",
  }[status];

  const StatusIcon = ({ status }: { status: Review["status"] }) => {
    switch (status) {
      case "CREATED":
        return <PlusCircle className="h-4 w-4 text-blue-500" />;
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "DONE":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <Badge
      variant="outline"
      className={`${colorClass} flex w-max items-center gap-1`}
    >
      <StatusIcon status={status} />
      {status.replace("_", " ")}
    </Badge>
  );
};

export const columns: ColumnDef<Review>[] = [
  {
    accessorKey: "application.id",
    header: "Application ID",
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
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const review = row.original;
      return (
        <div className="mr-4 flex justify-end gap-2">
          <DeleteAlertDialog
            inputReviewId={review.id}
            inputOpportunityId={review.application.opportunityId}
          >
            <Button type="button" variant="destructive">
              <Trash className="mr-2" />
              Delete
            </Button>
          </DeleteAlertDialog>

          <Button asChild>
            <Link href={`review/${review.id}`}>
              <Edit className="mr-2" />
              Edit
            </Link>
          </Button>
        </div>
      );
    },
  },
];
