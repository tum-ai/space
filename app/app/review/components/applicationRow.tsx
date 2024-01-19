"use client";
import { Button } from "@components/ui/button";
import ProtectedItem from "@components/ProtectedItem";
import Tooltip from "@components/Tooltip";
import { ViewReview } from "./viewReview";
import { Review } from "@models/review";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { TableCell, TableRow } from "@components/ui/table";

export function ApplicationRow({ application }) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      axios.delete("/applications/delete_application/", {
        params: { id: id },
      }),
  });

  const finalScoreSum = application.reviews?.reduce(
    (finalscore: number, review: Review) => {
      return finalscore + review.finalscore;
    },
    0,
  );
  return (
    <TableRow className="border-b dark:border-gray-500 " key={application.id}>
      <TableCell>{application.id}</TableCell>
      <TableCell>
        {/* TODO: This is a quick hack for the TUM.ai WS23 application */}
        {application.submission.data.fields[4].value}{" "}
        {application.submission.data.fields[5].value}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          {application.reviews?.map((review: Review, i: number) => {
            const profile = review.reviewer;
            return (
              <ViewReview
                applicationToView={application}
                viewReview={review}
                key={`application-${application.id}-review-${i}`}
                trigger={
                  <span>
                    <Tooltip
                      trigger={
                        <div className="cursor-pointer">
                          <DocumentMagnifyingGlassIcon className="h-8" />
                        </div>
                      }
                    >
                      <div>
                        {profile.firstName +
                          " " +
                          profile.lastName +
                          " - final score: " +
                          review.finalscore}
                      </div>
                    </Tooltip>
                  </span>
                }
              />
            );
          })}
        </div>
      </TableCell>
      <TableCell>
        {Math.round((finalScoreSum * 100) / application.reviews?.length) /
          100 || "-"}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button className="flex items-center space-x-2">
            <Link href={`${pathname}/${application.id}`}>Review</Link>
          </Button>
          <ProtectedItem roles={["admin"]}>
            <Button
              onClick={async () => {
                if (
                  confirm(
                    "Are you sure you want to delete this application and all its associated reviews?",
                  )
                ) {
                  toast
                    .promise(deleteMutation.mutateAsync(application.id), {
                      loading: "Deleting Application",
                      success: "Successfully deleted Application",
                      error: "Failed to delete Application",
                    })
                    .then(() =>
                      queryClient.invalidateQueries({
                        queryKey: ["applications"],
                      }),
                    );
                }
              }}
            >
              Delete
            </Button>
          </ProtectedItem>
        </div>
      </TableCell>
    </TableRow>
  );
}
