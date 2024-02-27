import { Card, CardFooter, CardHeader, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Opportunity } from "@prisma/client";
import LoadingWheel from "@components/LoadingWheel";
import { format } from "date-fns";

interface OpportunityCardProps {
  opportunity: Opportunity;
  count?: number;
}

export default function OpportunityCard({
  opportunity,
  count,
}: OpportunityCardProps) {
  return (
    <Card className="flex flex-col justify-between overflow-hidden">
      <div>
        <CardHeader className="text-3xl">{opportunity.title}</CardHeader>
        <CardContent className="flex flex-col gap-4">
          <span className="flex flex-row items-center gap-2 text-slate-500">
            <CalendarIcon />
            <p>
              {format(opportunity.start, "PPP")}
              {opportunity.end && ` - ${format(opportunity.end, "PPP")}`}
            </p>
          </span>
          {count !== undefined ? (
            <p className="text-2xl">
              {count} applicant{count !== 1 && "s"}
            </p>
          ) : (
            <LoadingWheel />
          )}
          {opportunity.description}
        </CardContent>
      </div>
      <CardFooter className="mt-auto grid grid-cols-3 divide-x divide-solid border-t p-0">
        <Button className="rounded-none" asChild variant="ghost">
          <Link href={"/opportunities/" + +opportunity.id + "/dashboard"}>
            Dashboard
          </Link>
        </Button>

        <Button className="rounded-none" asChild variant="ghost">
          <Link href={"/opportunities/" + +opportunity.id + "/edit"}>Edit</Link>
        </Button>

        <Button className="rounded-none" asChild variant="ghost">
          <Link href={"/opportunities/" + +opportunity.id}>Applications</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
