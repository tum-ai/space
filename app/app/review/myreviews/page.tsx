"use client";
import { Avatar } from "@components/Avatar";
import { Button } from "@components/Button";
import ProtectedItem from "@components/ProtectedItem";
import { Section } from "@components/Section";
import Tooltip from "@components/Tooltip";
import { useStores } from "@providers/StoreProvider";
import { observer } from "mobx-react";
import Link from "next/link";
import { ViewReview } from "../_components/viewReview";

const MyReviews = observer(() => {
  const { reviewToolModel, meModel } = useStores();
  const myreviews = reviewToolModel.myreviews;

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
            {myreviews.map((myreview) => {
              const finalScoreSum = myreview.application.reviews?.reduce(
                (finalscore, review) => {
                  return finalscore + review.finalscore;
                },
                0,
              );
              return (
                <tr className="border-b dark:border-gray-500" key={myreview.id}>
                  <td>{myreview.application.id}</td>
                  <td>{myreview.application.submission?.data?.formName}</td>
                  <td className="flex items-center justify-center p-4">
                    {myreview.application.reviews.map((review) => {
                      const profile = review.reviewer;
                      return (
                        <ViewReview
                          applicationToView={myreview.application}
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
                        myreview.application.reviews?.length,
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
                          reviewToolModel.deleteReview(myreview.application.id);
                        }
                      }}
                    >
                      delete
                    </Button>
                    <ViewReview
                      applicationToView={myreview.application}
                      viewReview={{
                        ...myreview,
                        reviewer: meModel.user.profile,
                      }}
                      trigger={<Button>view</Button>}
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
