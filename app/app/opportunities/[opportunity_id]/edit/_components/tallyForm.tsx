import { OpportunitySchema } from "@lib/schemas/opportunity";
import { useFormContext } from "react-hook-form";

export const TallyForm = () => {
  const form = useFormContext<z.infer<typeof OpportunitySchema>>();
  return <></>;
};
