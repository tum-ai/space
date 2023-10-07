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
    <tr className="border-b dark:border-gray-500 " key={application.id}>
      <td>{application.id}</td>
      <td>
        <div className="flex items-center justify-center gap-1">
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
                        {profile.first_name +
                          " " +
                          profile.last_name +
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
      </td>
      <td>
        {Math.round((finalScoreSum * 100) / application.reviews?.length) /
          100 || "-"}
      </td>
      <td className="flex justify-end space-x-2 p-4">
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
      </td>
    </tr>
  );
}
