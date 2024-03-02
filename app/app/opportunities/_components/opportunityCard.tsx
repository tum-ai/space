import { Card, CardFooter, CardHeader, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Opportunity } from "@prisma/client";
import { format } from "date-fns";
import { Badge } from "@components/ui/badge";

interface OpportunityCardProps {
  opportunity: Opportunity;
  isAdmin?: boolean;
}

export default function OpportunityCard({
  opportunity,
  isAdmin = false,
}: OpportunityCardProps) {
  return (
    <Card className="flex flex-col justify-between overflow-hidden">
      <div>
        <CardHeader>
          <div className="flex justify-between">
            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              {opportunity.title}
            </h2>
            {opportunity.status === "MISSING_CONFIG" && (
              <div>
                <Badge variant="destructive">Incomplete</Badge>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <span className="flex flex-row items-center gap-2 text-slate-500">
            <CalendarIcon />
            <p>
              {format(opportunity.start, "PPP")}
              {opportunity.end && ` - ${format(opportunity.end, "PPP")}`}
            </p>
          </span>
          {opportunity.description}
        </CardContent>
      </div>
      <CardFooter className="mt-auto grid grid-cols-3 divide-x divide-solid border-t p-0">
        {isAdmin && (
          <>
            <Button className="rounded-none" asChild variant="ghost">
              <Link href={"/opportunities/" + +opportunity.id + "/review"}>
                Review
              </Link>
            </Button>

            <Button className="rounded-none" asChild variant="ghost">
              <Link href={"/opportunities/" + +opportunity.id + "/edit"}>
                Edit
              </Link>
            </Button>
          </>
        )}

        <Button className="rounded-none" asChild variant="ghost">
          <Link href={"/opportunities/" + +opportunity.id}>Applications</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
