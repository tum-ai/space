import { Section } from "@components/Section";
import { Button } from "@components/ui/button";
import {
  TableIcon,
  RowsIcon,
  MixerHorizontalIcon,
} from "@radix-ui/react-icons";
import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs";

export default function ReviewOverview() {
  return (
    <Section className="space-y-6">
      <OverviewHeader />
      <OverviewToolBar />
    </Section>
  );
}

function OverviewHeader() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full flex-row items-center justify-between">
        <h1 className="text-6xl font-thin">Applications</h1>
        <Button>All opportunities</Button>
      </div>
      <p>View all availavle Applications</p>
      <h2 className="text-2xl">Winter Semester 2024/2025 Application</h2>
    </div>
  );
}

function OverviewToolBar() {
  return (
    <div className="flex h-20 w-full flex-row space-x-2">
      <Button variant="outline" size="default" className="w-full">
        Filter
      </Button>
      <Button variant="outline" size="default">
        <MixerHorizontalIcon className="mr-2" />
        Filter
      </Button>
      <Tabs defaultValue="rows">
        <TabsList className="h-10">
          <TabsTrigger value="rows">
            <RowsIcon />
          </TabsTrigger>
          <TabsTrigger value="table">
            <TableIcon />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
