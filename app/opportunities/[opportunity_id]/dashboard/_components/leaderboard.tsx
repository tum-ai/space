import type { Review, User } from "@prisma/client";
import { Medal, Trophy, Award } from "lucide-react";
import { useMemo } from "react";

export function Leaderboard({
  reviews,
}: {
  reviews: (Review & { user: User })[];
}) {
  const chartData = useMemo(() => {
    const groupedData = reviews.reduce(
      (acc, review) => {
        const userId = review.user.id;
        const userName = review.user.name!;
        if (!acc[userId]) {
          acc[userId] = {
            id: userId,
            user: userName,
            value: 0,
          };
        }
        acc[userId].value += 1;
        return acc;
      },
      {} as Record<string, { id: string; user: string; value: number }>,
    );

    return Object.values(groupedData).sort((a, b) => b.value - a.value);
  }, [reviews]);

  const sortedReviewers = [...chartData].sort((a, b) => b.value - a.value);
  const topThree = sortedReviewers.slice(0, 3);

  return (
    <div className="flex items-end justify-center space-x-4">
      {topThree.map((reviewer, index) => (
        <div key={reviewer.user} className="flex flex-col items-center">
          <div
            className={`w-20 h-${["28", "24", "20"][index]} flex flex-col items-center justify-end rounded-t-lg bg-primary p-2`}
          >
            {index === 0 && <Trophy className="mb-2 h-8 w-8 text-yellow-300" />}
            {index === 1 && <Medal className="mb-2 h-8 w-8 text-gray-300" />}
            {index === 2 && <Award className="mb-2 h-8 w-8 text-orange-300" />}
            <span className="font-bold text-primary-foreground">
              {reviewer.value}
            </span>
          </div>
          <div className="w-20 rounded-b-lg bg-muted p-2 text-center">
            <p className="truncate text-sm font-semibold">{reviewer.user}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
