import DefinePhases from "./DefinePhases";
import DefineQuestions from "./DefineQuestions";

const phases = {
  "Screening Phase": ["Screening"],
  "Interview Phase": ["Venture Interview", "RnD Interview", "Legal Interview"],
  "Decision Phase": ["Venture Decision", "RnD Decision", "Legal Decision"],
};

export default function DefineSteps() {
  return (
    <div className="space-y-14">
      <DefinePhases phases={phases} />
      <DefineQuestions />
    </div>
  );
}
