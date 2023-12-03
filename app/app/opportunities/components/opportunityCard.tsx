import { Card, CardFooter, CardHeader, CardContent } from "@components/ui/card";
import {Button} from "@components/ui/button";
import {CalendarIcon} from "@radix-ui/react-icons"
export default function OpportunityCard(props:any) {
    return (
            <Card className="flex flex-col">
                <CardHeader className="text-3xl">{props.title}</CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <span className="flex flex-row gap-2 items-center text-slate-500">
                        <CalendarIcon/>
                        <p>{props.date}</p>
                    </span>
                    <p className="text-2xl">
                        {props.participants} Applicants
                    </p>
                    {props.description}
                </CardContent>
                <CardFooter className="flex flex-cols gap-4">
                    <Button className="w-full">Dashboard</Button>
                    <Button className="w-full">Edit</Button>
                    <Button className="w-full">View</Button>
                </CardFooter>
            </Card>
    );
}
