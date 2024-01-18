import { Section } from "@components/Section";
import { Button } from "@components/ui/button";
import {
  TableIcon,
  RowsIcon,
  MixerHorizontalIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs";
import Input from "@components/Input";
import Link from "next/link";

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
        <Link href="../opportunities">
          <Button>All opportunities</Button>
        </Link>
      </div>
      <p>View all availavle Applications</p>
      <h2 className="text-2xl">Winter Semester 2024/2025 Application</h2>
    </div>
  );
}

function OverviewToolBar() {
  return (
    <div className="flex h-20 w-full flex-row space-x-2">
      <Input fullWidth placeholder="Search"></Input>
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

function OverviewList({ data }) {
	return (
		<div className="flex flex-col space-y-4">
			
		</div>
	);
}
