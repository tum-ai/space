import { useState } from "react";
import DefinePhases from "./DefinePhases";
import DefineQuestions from "./DefineQuestions";
import { Button } from "@components/ui/button";

const phases = [];

export default function DefineSteps({ form }) {
  const [currentForm, setCurrentForm] = useState();

  const handleChangeForm = (form) => {
    setCurrentForm(form);
  };

  return (
    <div className="space-y-14">
      <DefinePhases phases={phases} changeForm={handleChangeForm} form={form}/>
      <DefineQuestions form={currentForm} />
      <div className="flex justify-end">
        <Button type="submit">Create Opportunity</Button>
      </div>
    </div>
  );
}
