"use client";
import { Avatar } from "@components/Avatar";
import { Button } from "@components/ui/button";
import ProtectedItem from "@components/ProtectedItem";
import { Section } from "@components/Section";
import Tooltip from "@components/Tooltip";
import { useStores } from "@providers/StoreProvider";
import { observer } from "mobx-react";
import Link from "next/link";
import { ViewReview } from "../_components/viewReview";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Review } from "@models/review";
import LoadingWheel from "@components/LoadingWheel";
import toast from "react-hot-toast";
import { EditReview } from "../_components/editReview";

const MyReviews = observer(() => {
  const { meModel } = useStores();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["myreviews"],
    queryFn: () =>
      axios
        .get("/review_tool/myreviews/")
        .then((res) => res.data.data as Review[]),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      axios.delete("/review_tool/delete_review/", {
        params: { reviewee_id: id },
      }),
  });

  if (query.isLoading) {
    return <LoadingWheel />;
  }

  if (query.error) {
    return (
      <Section>
        <h1>Failed to load your reviews</h1>
      </Section>
    );
  }

  return (
    <ProtectedItem showNotFound roles={["submit_reviews"]}>
      <Section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-6xl font-thin">My Reviews</h1>
        <Button asChild className="w-max">
          <Link href={"/review/"}>Review Tool</Link>
        </Button>
      </Section>
      <Section className="flex overflow-auto">
        <table className="mx-auto w-full min-w-[800px] table-auto text-center">
          <thead>
            <tr className="border-b border-b-gray-400 dark:border-b-white">
              <th className="p-4">Application ID</th>
              <th className="p-4">Application Form</th>
              <th className="p-4">Reviewers</th>
              <th className="p-4">Avg. Final Score</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {query.data?.map((review) => {
              const finalScoreSum = review.application.reviews?.reduce(
                (finalscore, review) => {
                  return finalscore + review.finalscore;
                },
                0,
              );
              return (
                <tr className="border-b dark:border-gray-500" key={review.id}>
                  <td>{review.application.id}</td>
                  <td>{review.application.submission?.data?.formName}</td>
                  <td className="flex items-center justify-center p-4">
                    {review.application.reviews.map((review) => {
                      const profile = review.reviewer;
                      return (
                        <ViewReview
                          applicationToView={review.application}
                          viewReview={review}
                          key={review.id}
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
                    {Math.round(
                      (finalScoreSum * 100) /
                      review.application.reviews?.length,
                    ) / 100 || "-"}
                  </td>
                  <td className="space-x-2 p-4">
                    <Button
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete this review?",
                          )
                        ) {
                          toast
                            .promise(
                              deleteMutation.mutateAsync(review.application.id),
                              {
                                loading: "Deleting review",
                                success: "Successfully deleted review",
                                error: "Failed to delete review",
                              },
                            )
                            .then(() =>
                              queryClient.invalidateQueries({
                                queryKey: ["myreviews"],
                              }),
                            );
                        }
                      }}
                    >
                      Delete
                    </Button>
                    <ViewReview
                      applicationToView={review.application}
                      viewReview={{
                        ...review,
                        reviewer: meModel.user.profile,
                      }}
                      trigger={<Button>View</Button>}
                    />
                    <EditReview
                      review={review}
                      trigger={<Button type="button">Edit</Button>}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Section>
    </ProtectedItem>
  );
});

export default MyReviews;
