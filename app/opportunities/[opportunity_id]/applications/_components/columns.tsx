"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { type Prisma } from "@prisma/client";
import { Button } from "@components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarImage } from "@components/ui/avatar";
import { format, isToday, isYesterday } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip";

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
      name: true;
      reviews: {
        select: {
          id: true;
          user: {
            select: { image: true; name: true };
          };
        };
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
    accessorKey: "name",
    header: () => "Name",
  },
  {
    accessorKey: "_count.reviews",
    header: () => "Reviews",
    cell: ({ row }) => {
      return (
        <div className="flex -space-x-3 overflow-hidden">
          {row.original.reviews.map((review, i) => (
            <Tooltip key={i}>
              <TooltipTrigger>
                <Link href={`review/${review.id}`}>
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
