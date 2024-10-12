"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@components/ui/chart";
import type { Application } from "@prisma/client";
import { format } from "date-fns";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface Props<DataPoint extends Pick<Application, "id" | "createdAt">> {
  title: string;
  applications: DataPoint[];
  className?: string;
}

export const TimestampLineChart = <
  DataPoint extends Pick<Application, "id" | "createdAt">,
>({
  applications,
  title,
  className,
}: Props<DataPoint>) => {
  const groupedApplications = applications.reduce(
    (acc, application) => {
      const dateKey = application.createdAt.toISOString().split("T")[0]!;
      const existingEntry = acc.find((entry) => entry.date === dateKey);
      if (existingEntry) {
        existingEntry.timestamps.push(application.createdAt);
      } else {
        acc.push({ date: dateKey, timestamps: [application.createdAt] });
      }
      return acc;
    },
    [] as { date: string; timestamps: Date[] }[],
  );

  const applicationsPerDay = groupedApplications.map((group) => ({
    date: group.date,
    count: group.timestamps.length,
  }));

  const earliestDate = applications[0]?.createdAt;
  const latestDate = applications[applications.length - 1]?.createdAt;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {earliestDate && latestDate
            ? `From ${format(earliestDate, "MMMM dd, yyyy")} to ${format(latestDate, "MMMM dd, yyyy")}`
            : "No applications available"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={applicationsPerDay}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              minTickGap={16}
              tickMargin={8}
              tickFormatter={(value) =>
                format(new Date(value as string), "MMM dd")
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="count"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
              type="monotone"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
