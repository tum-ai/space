import { Card, CardFooter, CardHeader, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Opportunity } from "@prisma/client";
import { format } from "date-fns";
import { BarChart2, Edit, Eye, Users } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip";

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

      <CardFooter className="mt-auto flex divide-x divide-solid border-t p-0">
        {isAdmin && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="flex-1 rounded-none" asChild variant="ghost">
                <Link
                  href={"opportunities/" + +opportunity.id + "/leaderboard"}
                >
                  <BarChart2 />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Leaderboard</p>
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="flex-1 rounded-none" asChild variant="ghost">
              <Link href={"opportunities/" + +opportunity.id + "/review"}>
                <Eye />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Review</p>
          </TooltipContent>
        </Tooltip>

        {isAdmin && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="flex-1 rounded-none" asChild variant="ghost">
                <Link
                  href={"opportunities/" + +opportunity.id + "/applications"}
                >
                  <Users />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Applications</p>
            </TooltipContent>
          </Tooltip>
        )}

        {isAdmin && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="flex-1 rounded-none" asChild variant="ghost">
                <Link href={"opportunities/" + +opportunity.id + "/edit"}>
                  <Edit />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
        )}
      </CardFooter>
    </Card>
  );
}
