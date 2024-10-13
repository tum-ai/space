import { ApplicationField } from "@components/application/applicationField";
import { type TallyField } from "@lib/types/tally";

interface Props {
  field: TallyField;
}

export const TallyFieldForm = ({ field }: Props) => {
  return (
    <div key={field.key}>
      <ApplicationField field={field} className="w-full" />
    </div>
  );
};
