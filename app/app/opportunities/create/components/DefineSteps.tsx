import DefinePhases from "./DefinePhases";
import DefineQuestions from "./DefineQuestions";
import { Button } from "@components/ui/button";

const phases = {
  "Screening Phase": ["Screening"],
  "Interview Phase": ["Venture Interview", "RnD Interview", "Legal Interview"],
  "Decision Phase": ["Venture Decision", "RnD Decision", "Legal Decision"],
};

export default function DefineSteps( form ) {
  return (
    <div className="space-y-14">
      <DefinePhases phases={phases} form={form} />
      <DefineQuestions form={phases["Screening Phase"][0]} />
      <div className="flex justify-end">
        <Button type="submit">Create Opportunity</Button>
      </div>
    </div>
  );
}
