import { Tally, TallyField } from "@lib/types/tally";
import { Application, Questionnaire } from "@prisma/client";
import db from "server/db";

export const connectQuestionnaires = (
  application: Application,
  questionnaires: Questionnaire[],
) => {
  return db.application.update({
    where: { id: application.id },
    data: {
      questionnaires: {
        connect: questionnaires
          .filter((questionnaire) => {
            if (
              !questionnaire.conditions ||
              (questionnaire.conditions as Questionnaire["conditions"][])
                .length === 0
            ) {
              return true;
            }

            for (const condition of questionnaire.conditions as Pick<
              TallyField,
              "key" | "value"
            >[]) {
              const field = (application.content as Tally).data.fields.find(
                (f) => f.key === condition.key,
              );
              if (!field) continue;

              const fieldValue = field.value;
              let conditionMet = false;

              if (isArrayofStrings(fieldValue)) {
                conditionMet = fieldValue.includes(condition.value as string);
              } else if (typeof fieldValue === "string") {
                conditionMet = fieldValue === condition.value;
              }

              if (conditionMet) return true;
            }
            return false;
          })
          .map((questionnaire) => ({ id: questionnaire.id })),
      },
    },
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isArrayofStrings(value: any): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}
