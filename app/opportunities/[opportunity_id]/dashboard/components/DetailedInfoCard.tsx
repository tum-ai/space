import { Card, CardFooter, CardHeader, CardContent } from "@components/ui/card";
interface Props {
  title: string;
  data: string;
  growthInPercent: number;
  children: React.ReactNode;
}

export default function DetailedInfoCard(props: Props) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <p className="text-slate-500">{props.title}</p>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <p className="text-5xl font-bold">{props.data}</p>
        {props.children}
      </CardContent>
      <CardFooter className="flex-cols flex gap-4">
        <p className="text-slate-500">
          +{props.growthInPercent}% from last month
        </p>
      </CardFooter>
    </Card>
  );
}
