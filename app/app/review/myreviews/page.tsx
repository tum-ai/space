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
  const { reviewToolModel } = useStores();
  const myreviews = reviewToolModel.myreviews;
  console.log(myreviews);

  return (
    <ProtectedItem showNotFound roles={["submit_reviews"]}>
      <Section className="flex items-center justify-between">
        <div className="text-6xl font-thin">My reviews</div>
        <Link href={"/review/"}>
          <Button>Review Tool</Button>
        </Link>
      </Section>
      <Section className="flex overflow-auto">
        <table className="mx-auto w-full min-w-[500px] table-auto text-center">
          <thead>
            <tr className="border-b">
              <th className="p-4">Application ID</th>
              <th>Reviewers</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {myreviews.map((myreview) => (
              <tr
                className="border-b bg-gray-100 dark:bg-gray-700"
                key={myreview.id}
              >
                <td>{myreview.application.id}</td>
                <td className="flex items-center justify-center">
                  {myreview.application.reviews.map((review) => {
                    const profile = review.reviewer;
                    return (
                      <ViewReview
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
                  <Button>delete</Button>
                  <Button>view</Button>
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
