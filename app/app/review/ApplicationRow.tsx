"use client";
import { Avatar } from "@components/Avatar";
import { Button } from "@components/Button";
import ProtectedItem from "@components/ProtectedItem";
import Tooltip from "@components/Tooltip";
import { ViewReview } from "./_components/viewReview";
import { Review } from "@models/application";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function ApplicationRow({ application }) {
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
      <td>{application.submission?.data?.formName}</td>
      <td className="flex items-center justify-center gap-1 p-4">
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
                        <Avatar
                          variant={"circle"}
                          profilePicture={profile.profile_picture}
                          initials={(
                            "" +
                            profile.first_name[0] +
                            profile.last_name[0]
                          ).toUpperCase()}
                        />
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
      </td>
      <td>
        {Math.round((finalScoreSum * 100) / application.reviews?.length) /
          100 || "-"}
      </td>
      <td className="space-x-2 p-4">
        <Button className="flex items-center space-x-2">
          <Link href={`/review/${application.id}`}>Review</Link>
        </Button>
        <ProtectedItem roles={["admin"]}>
          <Button
            onClick={async () => {
              if (
                confirm(
                  "Are you sure you want to delete this application and all its associated reviews?",
                )
              ) {
                deleteMutation.mutate(application.id);
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