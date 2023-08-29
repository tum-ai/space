"use client";
import { Avatar } from "@components/Avatar";
import { Button } from "@components/Button";
import ProtectedItem from "@components/ProtectedItem";
import { Section } from "@components/Section";
import Tooltip from "@components/Tooltip";
import { useStores } from "@providers/StoreProvider";
import { observer } from "mobx-react";
import Link from "next/link";
import { ViewReview } from "../page";

const MyReviews = observer(() => {
  const { reviewToolModel, meModel } = useStores();
  const myreviews = reviewToolModel.myreviews;

  return (
    <ProtectedItem showNotFound roles={["submit_reviews"]}>
      <Section className="flex items-center justify-between">
        <div className="text-6xl font-thin">My reviews</div>
        <Link href={"/review/"}>
          <Button>Review Tool</Button>
        </Link>
      </Section>
      <Section className="flex overflow-auto">
        <table className="mx-auto w-full min-w-[800px] table-auto text-center">
          <thead>
            <tr className="border-b">
              <th className="p-4">Application ID</th>
              <th className="p-4">Application Form</th>
              <th className="p-4">Reviewers</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {myreviews.map((myreview) => (
              <tr
                className="border-b bg-gray-100 dark:border-gray-500 dark:bg-gray-700"
                key={myreview.id}
              >
                <td>{myreview.application.id}</td>
                <td>{myreview.application.submission?.data?.formName}</td>
                <td className="flex items-center justify-center p-4">
                  {myreview.application.reviews.map((review) => {
                    const profile = review.reviewer;
                    return (
                      <ViewReview
                        key={review.id}
                        trigger={
                          <span>
                            <Tooltip
                              trigger={
                                <div
                                  className="cursor-pointer"
                                  onClick={() => {
                                    reviewToolModel.setViewReview(review);
                                    reviewToolModel.setViewApplication(
                                      myreview.application,
                                    );
                                  }}
                                >
                                  <Avatar
                                    variant={Avatar.variant.Circle}
                                    src={profile.profile_picture}
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
                <td className="space-x-2 p-4">
                  <Button
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this review?")
                      ) {
                        reviewToolModel.deleteReview(myreview.application.id);
                      }
                    }}
                  >
                    delete
                  </Button>
                  <ViewReview
                    trigger={
                      <Button
                        onClick={() => {
                          reviewToolModel.setViewReview({
                            ...myreview,
                            reviewer: meModel.user.profile,
                          });
                          reviewToolModel.setViewApplication(
                            myreview.application,
                          );
                        }}
                      >
                        view
                      </Button>
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </ProtectedItem>
  );
});

export default MyReviews;
