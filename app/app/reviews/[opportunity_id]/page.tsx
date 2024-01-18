import { Section } from "@components/Section";
import Tabs from "@components/Tabs";
import { Button } from "@components/ui/button";
import { TableIcon, RowsIcon, MixerHorizontalIcon } from "@radix-ui/react-icons";

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
	<div className="flex flex-row w-full justify-between items-center">
		<h1 className="text-6xl font-thin">Applications</h1>
		<Button>
			All opportunities
		</Button>
	</div>
      <p>View all availavle Applications</p>
	  <h2 className="text-2xl">Winter Semester 2024/2025 Application</h2>
    </div>
  );
}

function OverviewToolBar() {
	return (
		<div className="flex flex-row w-full space-x-2 h-20">
			<Button variant="outline" size="default" className="w-full">
				Filter
			</Button>
			<Button variant="outline" size="default">
				<MixerHorizontalIcon className="mr-2"/>
				Filter
			</Button>
			<Button variant="outline" size="default" className="rounded-full">
				<RowsIcon />
			</Button>
			<Button variant="outline" size="default" className="rounded-full">
				<TableIcon />
			</Button>
			<Tabs />
		</div>
	);
}
