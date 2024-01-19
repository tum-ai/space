import { Card, CardFooter, CardHeader, CardContent } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import Link from "next/link";
export default function OpportunityCard(props: any) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="text-3xl">{props.opportunity.title}</CardHeader>
      <CardContent className="flex flex-col gap-4">
        <span className="flex flex-row items-center gap-2 text-slate-500">
          <CalendarIcon />
          <p>{props.opportunity.date}</p>
        </span>
        <p className="text-2xl">{props.opportunity.participants} Applicants</p>
        {props.opportunity.description}
      </CardContent>
      <CardFooter className="flex-cols flex gap-4">
        <Link href={"./dashboard/" + +props.opportunity.id} className="w-full">
          <Button className="w-full">Dashboard</Button>
        </Link>
        <Link href={"./edit/" + +props.opportunity.id} className="w-full">
          <Button className="w-full">Edit</Button>
        </Link>
        <Link href={"./reviews/" + +props.opportunity.id} className="w-full">
          <Button className="w-full">View</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
