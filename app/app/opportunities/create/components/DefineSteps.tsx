import { useState } from "react";
import DefinePhases from "./DefinePhases";
import DefineQuestions from "./DefineQuestions";
import { Button } from "@components/ui/button";

export default function DefineSteps({ form }) {
  const [currentFormData, setCurrentFormData] = useState({form: "", questionField: [], appendQuestion: () => {}, removeQuestion: () => {}});

  const handleChangeForm = (form, questionField, appendQuestion, removeQuestion) => {
    setCurrentFormData({ form, questionField, appendQuestion, removeQuestion});
  };

  return (
    <div className="space-y-14">
      <DefinePhases questionHandler={handleChangeForm} form={form} />
      <DefineQuestions formData={currentFormData}/>
      <div className="flex justify-end">
        <Button type="submit">Create Opportunity</Button>
      </div>
    </div>
  );
}
