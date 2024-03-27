import { Card } from "@components/ui/card";

interface Props {
  data: string;
  description: string;
}

export default function ClickableInfoCard(props: Props) {
  return (
    <Card
      className={`flex aspect-square flex-col items-center justify-center gap-4`}
    >
      <p className="text-7xl font-bold">{props.data}</p>
      <p className="text-slate-500">{props.description}</p>
    </Card>
  );
}
