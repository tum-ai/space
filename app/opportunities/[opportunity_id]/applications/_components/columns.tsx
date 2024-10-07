"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type Prisma } from "@prisma/client";
import { Button } from "@components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage } from "@components/ui/avatar";
import { format, isToday, isYesterday } from "date-fns";

const formatDate = (date: Date) => {
  if (isToday(date)) {
    return `Today at ${format(date, "h:mm a")}`;
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, "h:mm a")}`;
  } else {
    return format(date, "MMM d, yyyy 'at' h:mm a");
  }
};

export const columns: ColumnDef<
  Prisma.ApplicationGetPayload<{
    select: {
      id: true;
      createdAt: true;
      _count: {
        select: { reviews: true };
      };
      content: true;
      reviews: {
        select: { id: true; user: { select: { image: true } } };
      };
    };
  }>
>[] = [
  {
    accessorKey: "id",
    header: () => "ID",
  },
  {
    accessorKey: "createdAt",
    header: () => "Created At",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    accessorKey: "content",
    header: () => "Name",
    cell: ({ row }) => {
      const firstName = (row.original.content as any).data?.fields
        .filter((field: any) => field.key === "question_gaMNpP")
        .map((field: any) => field.value)
        .join(" ");
      const lastName = (row.original.content as any).data.fields
        .filter((field: any) => field.key === "question_yM9qG8")
        .map((field: any) => field.value)
        .join(" ");

      return firstName + " " + lastName;
    },
  },
  {
    accessorKey: "_count.reviews",
    header: () => "Reviews",
    cell: ({ row }) => {
      return (
        <div className="flex -space-x-3 overflow-hidden">
          {row.original.reviews.map((review, i) => (
            <Link key={i} href={`review/${review.id}`}>
              <Avatar className="border">
                <AvatarImage src={review.user.image ?? undefined} />
              </Avatar>
            </Link>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "View",
    cell: ({ row }) => {
      const application = row.original;

      return (
        <Button size="icon" asChild>
          <Link href={`applications/${application.id}`}>
            <Eye />
          </Link>
        </Button>
      );
    },
  },
];
