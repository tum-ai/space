import { Card, CardFooter, CardHeader, CardContent } from "@components/ui/card";

export default function ClickableInfoCard(props:any) {
    return (
        <Card className={`flex flex-col aspect-square justify-center items-center gap-4 ${props.dark ? "bg-black text-white" : ""}`} >
                <p className="text-7xl font-bold">{props.data}</p>
                <p className="text-slate-500">{props.description}</p>
        </Card>
    );
}
