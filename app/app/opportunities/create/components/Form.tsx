import { Card } from "@components/ui/card";
import { TrashIcon } from "@radix-ui/react-icons";

export default function Form({
  formName,
  questionHandler,
  formIndex,
  phaseIndex,
  removeForm,
}) {

  return (
    <Card
      className="flex w-full items-center justify-between py-2 pl-3 text-sm font-light hover:bg-gray-100"
      onClick={() =>  questionHandler(formName, phaseIndex, formIndex)}
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
