"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Prisma } from "@prisma/client";
import { Button } from "@components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<
  Prisma.ApplicationGetPayload<{
    include: { _count: { select: { reviews: true } } };
  }>
>[] = [
  {
    accessorKey: "id",
    header: () => "ID",
  },
  {
    accessorKey: "createdAt",
    header: () => "Created At",
  },
  {
    accessorKey: "_count.reviews",
    header: () => "Reviews",
  },
  {
    id: "actions",
    header: "View",
    cell: ({ row }) => {
      const application = row.original;

      return (
        <Button size="icon" asChild>
          <Link href={`applications/${application.id}`}>
            <Edit />
          </Link>
        </Button>
      );
    },
  },
];
