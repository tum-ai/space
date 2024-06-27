import { faker } from "@faker-js/faker";
import { Tally, TallyData, TallyField } from "@lib/types/tally";
import { keyUniqueEnforcer, now, options } from "./utils";
import db from "server/db";

enum FieldTypes {
  CHECKBOXES = "CHECKBOXES",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  DROPDOWN = "DROPDOWN",
  MATRIX = "MATRIX",
}

enum NormalFieldTypes {
  TEXTAREA = "TEXTAREA",
  INPUT_TEXT = "INPUT_TEXT",
  INPUT_NUMBER = "INPUT_NUMBER",
  INPUT_DATE = "INPUT_DATE",
  INPUT_EMAIL = "INPUT_EMAIL",
  INPUT_LINK = "INPUT_LINK",
}

type Application = {
  content: Tally;
  opportunityId: number;
};

const minNumberOfApplications = parseInt(options.minapplications, 10);
const maxNumberOfApplications = parseInt(options.maxapplications, 10);

export async function generateApplications(opportunityIds: number[]) {
  const applications: Application[] = opportunityIds.flatMap((id) =>
    Array.from(
      {
        length: faker.number.int({
          min: minNumberOfApplications,
          max: maxNumberOfApplications,
        }),
      },
      () => generateApplication(id),
    ),
  );

  for (const application of applications) {
    await db.application.create({
      data: {
        content: application.content,
        opportunity: { connect: { id: application.opportunityId } },
      },
    });
  }

  return applications;
}

function generateApplication(opportunityId: number): Application {
  return {
    content: generateTallyContent(),
    opportunityId: opportunityId,
  };
}

function generateTallyContent(): Tally {
  return {
    eventId: faker.string.uuid(),
    eventType: "FORM_RESPONSE",
    createdAt: now.toISOString(),
    data: generateTallyData(),
  };
}

function generateTallyData(): TallyData {
  return {
    responseId: faker.string.nanoid(6),
    submissionId: faker.string.nanoid(6),
    respondentId: faker.string.nanoid(6),
    formId: faker.string.nanoid(6),
    formName: faker.science.chemicalElement().name,
    createdAt: now.toISOString(),
    fields: Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, () =>
      generateTallyField(),
    ),
  };
}

function generateTallyField(): TallyField {
  const fieldTypes: (string | FieldTypes)[] = Object.values(FieldTypes);
  const fieldType = faker.helpers.arrayElement(fieldTypes);

  const baseField = {
    label: faker.music.genre(),
    key: keyUniqueEnforcer.enforce(() => faker.string.nanoid(6)),
  };

  return generateTallyFieldDetails(baseField, fieldType);
}

function generateTallyFieldDetails(
  baseField: {
    label: string;
    key: string;
  },
  fieldType: string | FieldTypes,
): TallyField {
  switch (fieldType) {
    case FieldTypes.CHECKBOXES:
      const checkbox_options = Array.from(
        { length: faker.number.int({ min: 1, max: 4 }) },
        () => ({ id: faker.string.uuid(), text: faker.music.songName() }),
      );
      return {
        ...baseField,
        type: FieldTypes.CHECKBOXES,
        value: faker.helpers.arrayElements(
          checkbox_options.map((o) => o.id),
          { min: 1, max: 4 },
        ),
        options: checkbox_options,
      };

    case FieldTypes.DROPDOWN:
      const dropdown_options = Array.from(
        { length: faker.number.int({ min: 1, max: 4 }) },
        () => ({ id: faker.string.uuid(), text: faker.music.songName() }),
      );
      return {
        ...baseField,
        type: FieldTypes.DROPDOWN,
        value: faker.helpers.arrayElements(
          dropdown_options.map((o) => o.id),
          1,
        ),
        options: dropdown_options,
      };

    case FieldTypes.MULTIPLE_CHOICE:
      const multiple_options = Array.from(
        { length: faker.number.int({ min: 1, max: 4 }) },
        () => ({ id: faker.string.uuid(), text: faker.music.songName() }),
      );
      return {
        ...baseField,
        type: FieldTypes.MULTIPLE_CHOICE,
        value: faker.helpers.arrayElements(
          multiple_options.map((o) => o.id),
          1,
        ),
        options: multiple_options,
      };

    case FieldTypes.MATRIX:
      const rows = Array.from(
        { length: faker.number.int({ min: 3, max: 5 }) },
        () => ({ id: faker.string.uuid(), text: faker.lorem.word() }),
      );

      const columns = Array.from(
        { length: faker.number.int({ min: 3, max: 5 }) },
        () => ({ id: faker.string.uuid(), text: faker.word.adjective() }),
      );
      const value = rows.reduce(
        (acc, row) => {
          acc[row.id] = [faker.helpers.arrayElement(columns).id];
          return acc;
        },
        {} as Record<string, string[]>,
      );

      return {
        ...baseField,
        type: FieldTypes.MATRIX,
        value: value,
        rows: rows,
        columns: columns,
      }

    default:
      if (
        Object.values(NormalFieldTypes).includes(fieldType as NormalFieldTypes)
      ) {
        return {
          ...baseField,
          type: fieldType as NormalFieldTypes,
          value: faker.lorem.sentence(),
        };
      }
      throw new Error("Unknown field type");
  }
}
