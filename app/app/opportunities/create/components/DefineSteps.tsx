import { useState } from "react";
import DefinePhases from "./DefinePhases";
import DefineQuestions from "./DefineQuestions";
import { Button } from "@components/ui/button";
import { number } from "yup";

export default function DefineSteps({ form }) {
  const [currentFormData, setCurrentFormData] = useState({formName: "", phaseIndex: null, formIndex: null});

  const handleChangeForm = (formName: string, phaseIndex: number, formIndex: number) => {
    setCurrentFormData({ formName, phaseIndex, formIndex });
  };

  return (
    <div className="space-y-14">
      <DefinePhases questionHandler={handleChangeForm} form={form} />
      <DefineQuestions formData={currentFormData} control={form.control}/>
      <div className="flex justify-end">
        <Button type="submit">Create Opportunity</Button>
      </div>
    </div>
  );
}
