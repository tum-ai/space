import { useState } from "react";
import { Medal, Trophy, Award } from "lucide-react";
import { Progress } from "components/ui/progress";
import { Card, CardContent } from "components/ui/card";

type Reviewer = {
  name: string;
  applicationsReviewed: number;
};

interface LeaderboardProps {
  reviewers: Reviewer[];
}

export function Leaderboard({ reviewers }: LeaderboardProps) {
  const sortedReviewers = [...reviewers].sort(
    (a, b) => b.applicationsReviewed - a.applicationsReviewed,
  );
  const topThree = sortedReviewers.slice(0, 3);
  const others = sortedReviewers.slice(3);
  const maxReviews = sortedReviewers.at(0)?.applicationsReviewed ?? 1;

  return (
    <div className="p-6">
      <h1 className="mb-8 text-center text-3xl font-bold">The true MVPs</h1>

      <div className="mb-12 flex items-end justify-center space-x-4">
        {topThree.map((reviewer, index) => (
          <div key={reviewer.name} className="flex flex-col items-center">
            <div
              className={`w-32 h-${["28", "24", "20"][index]} flex flex-col items-center justify-end rounded-t-lg bg-primary p-2`}
            >
              {index === 0 && (
                <Trophy className="mb-2 h-8 w-8 text-yellow-300" />
              )}
              {index === 1 && <Medal className="mb-2 h-8 w-8 text-gray-300" />}
              {index === 2 && (
                <Award className="mb-2 h-8 w-8 text-orange-300" />
              )}
              <span className="font-bold text-primary-foreground">
                {reviewer.applicationsReviewed}
              </span>
            </div>
            <div className="w-32 rounded-b-lg bg-muted p-2 text-center">
              <p className="truncate text-sm font-semibold">{reviewer.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {others.map((reviewer, index) => (
          <div
            key={reviewer.name}
            className="flex items-center rounded-lg bg-muted p-4"
          >
            <span className="w-8 text-lg font-bold">{index + 4}.</span>
            <div className="flex-grow">
              <p className="font-semibold">{reviewer.name}</p>
              <div className="flex items-center">
                <Progress
                  value={(reviewer.applicationsReviewed / maxReviews) * 100}
                  className="h-2 w-full"
                />
                <span className="ml-2 flex text-sm font-medium">
                  {reviewer.applicationsReviewed}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
