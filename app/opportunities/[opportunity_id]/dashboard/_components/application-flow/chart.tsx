"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@components/ui/chart";
import { Sankey, Tooltip } from "recharts";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface LinkDataItem {
  source: number;
  target: number;
  [key: string]: any;
}
interface SankeyData {
  nodes: any[];
  links: LinkDataItem[];
}

export const Chart = ({ data }: { data: SankeyData }) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Application flow</CardTitle>
      </CardHeader>
      <CardContent>
        {/* <ChartContainer config={chartConfig}>
          <Sankey
            width={960}
            height={500}
            data={data}
            link={{ stroke: "#77c878" }}
          >
            <Tooltip content={<ChartTooltip />} />
          </Sankey>
        </ChartContainer> */}
      </CardContent>
    </Card>
  );
};
