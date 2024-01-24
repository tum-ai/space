import DefinePhases from "./DefinePhases";
import DefineQuestions from "./DefineQuestions";
import { Button } from "@components/ui/button";
import { useState } from "react";

const phases = {
  "Screening Phase": ["Screening"],
  "Interview Phase": ["Venture Interview", "RnD Interview", "Legal Interview"],
  "Decision Phase": ["Venture Decision", "RnD Decision", "Legal Decision"],
};

export default function DefineSteps({ form }) {
  const [currentForm, setCurrentForm] = useState();

  const handleChangeForm = (form) => {
    setCurrentForm(form);
  };

  return (
    <div className="space-y-14">
      <DefinePhases phases={phases} changeForm={handleChangeForm} />
      <DefineQuestions form={currentForm} />
      <div className="flex justify-end">
        <Button type="submit">Create Opportunity</Button>
      </div>
    </div>
  );
}
