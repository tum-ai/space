import { Card } from "@components/ui/card";
import { TrashIcon } from "@radix-ui/react-icons";
import { useFieldArray } from "react-hook-form";

export default function Form({
  formName,
  questionHandler,
  formIndex,
  phaseIndex,
  removeForm,
  control,
}) {

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: `defineSteps[${phaseIndex}].forms[${formIndex}].questions`,
  });

  return (
    <Card
      className="flex w-full items-center justify-between py-2 pl-3 text-sm font-light hover:bg-gray-100"
      onClick={() => questionHandler(formName, questionFields, appendQuestion, removeQuestion)}
    >
      {formName}
      <button
        onClick={() => removeForm(formIndex)}
        className="mr-3 text-gray-300 transition-colors duration-100 ease-in-out hover:text-gray-800"
      >
        <TrashIcon width={18} height={18} />
      </button>
    </Card>
  );
}
