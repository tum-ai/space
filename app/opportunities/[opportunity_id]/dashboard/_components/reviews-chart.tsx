"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@components/ui/chart";
import type { Review, User } from "@prisma/client";

export function ReviewsChart({
  reviews,
}: {
  reviews: (Review & { user: User })[];
}) {
  const chartData = React.useMemo(() => {
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

  const userConfig = React.useMemo(() => {
    const colors = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
    ];

    return chartData.reduce(
      (acc, { id, user }, index) => {
        acc[id] = {
          label: user,
          fill: colors[index % colors.length]!,
        };
        return acc;
      },
      {} as Record<string, { label: string; fill: string }>,
    );
  }, [chartData]);

  console.log(userConfig);

  const totalReviews = React.useMemo(() => {
    return reviews.length;
  }, [reviews]);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Reviewers</CardTitle>
        <CardDescription>Distribution of reviews</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={userConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="id"
              innerRadius={60}
              paddingAngle={1}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalReviews.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Reviews
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
