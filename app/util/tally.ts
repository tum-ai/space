import { TallyField } from "@models/application";

const findIdByLabel = (
  fields: TallyField[],
  label: string,
): number | undefined => {
  return fields.find(
    (field, i) => field.label.toLowerCase() === label.toLowerCase(),
  );
};
