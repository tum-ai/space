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
import { cn } from "@lib/utils";

export function ReviewsChart({
  reviews,
  className,
}: {
  reviews: (Review & { user: User })[];
  className?: string;
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
    return chartData.reduce(
      (acc, { id, user }) => {
        acc[id] = { label: user };
        return acc;
      },
      {} as Record<string, { label: string }>,
    );
  }, [chartData]);

  const totalReviews = React.useMemo(() => {
    return reviews.length;
  }, [reviews]);

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>Reviewers</CardTitle>
        <CardDescription>Distribution of reviews</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
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
              fill={"hsl(var(--chart-1))"}
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
