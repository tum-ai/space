import Tag from "@components/Tag";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import Image from "next/image";

interface Reviewer {
  name: string;
  imgSrc: string;
}

interface RowProps {
  id: string;
  name: string;
  phase: string;
  score: number;
  reviewers: Reviewer[];
}

interface OverviewRowsProps {
  data: Record<string, {
      firstName: string;
      lastName: string;
      phase: string;
      score: number;
      reviewer: Reviewer[];
    }>;
}

function OverviewRows({ data }: OverviewRowsProps) {
  console.log(data);
  return (
    <div className="flex flex-col space-y-4">
      {Object.entries(data).map(([id, vals]) => (
        <Row
          key={id}
          id={id}
          name={vals.firstName + " " + vals.lastName}
          phase={vals.phase}
          score={vals.score}
          reviewers={vals.reviewer}
        />
      ))}
    </div>
  );
}

function Row({ id, name, phase, score, reviewers }: RowProps) {
  return (
    <Card className="grid grid-cols-1 items-center gap-4 p-4 transition-colors duration-200 hover:bg-slate-50 md:grid-cols-3 md:p-2">
      <p className="font-normal">{name}</p>
      <div className="flex items-center justify-between space-x-5 md:justify-normal">
        <div className="grid grid-cols-3 gap-2">
          {reviewers.map((reviewer, index) => (
            <div key={index} className="h-10 w-10 overflow-hidden rounded-full">
              <Image
                src={reviewer.imgSrc}
                alt={`Bild von ${reviewer.name}`}
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
          ))}
        </div>
        <span>{`${reviewers.length}/3`}</span>
      </div>
      <div className="flex items-center justify-between space-x-5 md:justify-self-end">
        <div className="flex items-center space-x-5">
          <Tag text={phase} color="blue" />
          <Tag text={score.toString()} color="green" />
        </div>
        <div className="flex items-center space-x-5">
          <p>ID: {id}</p>
          <Button>View</Button>
        </div>
      </div>
    </Card>
  );
}

export default OverviewRows;
