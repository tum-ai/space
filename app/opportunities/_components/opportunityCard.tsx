import { Card, CardHeader, CardContent, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { format } from "date-fns";
import {
  BarChart2,
  Edit,
  Ellipsis,
  FileText,
  MessageSquareText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { cn } from "@lib/utils";
import { type OverviewOpportunity } from "../page";
import { Separator } from "components/ui/separator";

interface OpportunityCardProps {
  opportunity: OverviewOpportunity;
  onClick?: () => void;
  className?: string;
}

export default function OpportunityCard({
  opportunity,
  onClick,
  className,
}: OpportunityCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "flex h-full w-full flex-col justify-between overflow-hidden",
        className,
      )}
    >
      <div>
        <CardHeader className="p-4">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="truncate text-lg">
              {opportunity.title}
            </CardTitle>

            {opportunity.isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    className="text-muted-foreground"
                  >
                    <Ellipsis />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link
                      href={"opportunities/" + +opportunity.id + "/leaderboard"}
                    >
                      <BarChart2 className="mr-2 h-4 w-4" />
                      <span>Leaderboard</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href={"opportunities/" + +opportunity.id + "/edit"}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit </span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-1 p-4 pt-0">
          <span className="flex flex-row items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon />
            <p>
              {format(opportunity.start, "dd/MM/yy")}
              {opportunity.end && ` - ${format(opportunity.end, "dd/MM/yy")}`}
            </p>
          </span>
          <p className="truncate text-sm">{opportunity.description}</p>
        </CardContent>
      </div>

      <div>
        <Separator />
        <div className="flex divide-x divide-border">
          <Button variant="ghost" className="flex-1 rounded-none" asChild>
            <Link href={`opportunities/${opportunity.id}/applications`}>
              <FileText className="mr-2" />
              Applications
            </Link>
          </Button>
          <Button variant="ghost" className="flex-1 rounded-none" asChild>
            <Link href={`opportunities/${opportunity.id}/review`}>
              <MessageSquareText className="mr-2" />
              Review
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
