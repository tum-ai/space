import { Card, CardFooter, CardHeader, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Opportunity } from "@prisma/client";
import LoadingWheel from "@components/LoadingWheel";

interface OpportunityCardProps {
  opportunity: Opportunity;
  count?: number;
}

export default function OpportunityCard({
  opportunity,
  count,
}: OpportunityCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="text-3xl">{opportunity.title}</CardHeader>
      <CardContent className="flex flex-col gap-4">
        <span className="flex flex-row items-center gap-2 text-slate-500">
          <CalendarIcon />
          <p>
            {opportunity.opportunityStart.toLocaleDateString()}{" "}
            {opportunity.opportunityEnd &&
              ` - ${opportunity.opportunityEnd.toLocaleDateString()}`}
          </p>
        </span>
        {count !== undefined ? (
          <p className="text-2xl">{count} applicants</p>
        ) : (
          <LoadingWheel />
        )}
        {opportunity.description}
      </CardContent>
      <CardFooter className="flex-cols flex gap-4">
        <Link href={"./dashboard/" + +opportunity.id} className="w-full">
          <Button className="w-full">Dashboard</Button>
        </Link>
        <Link href={"./edit/" + +opportunity.id} className="w-full">
          <Button className="w-full">Edit</Button>
        </Link>
        <Link href={"./reviews/" + +opportunity.id} className="w-full">
          <Button className="w-full">View</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
