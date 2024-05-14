import { faker } from "@faker-js/faker";
import { Person } from "@lib/types/person";
import { UniqueEnforcer } from "enforce-unique";
import { z } from "zod";
import {
  OpportunitySchema,
  PhaseSchema,
  QuestionnaireSchema,
} from "@lib/schemas/opportunity";
import { Question } from "@lib/schemas/question";
import db from "server/db";
import { v4 as uuidv4 } from "uuid";

const now = new Date();

const emailUniqueEnforcer = new UniqueEnforcer();
const keyUniqueEnforcer = new UniqueEnforcer();
const uuidUniqueEnforcer = new UniqueEnforcer();

async function main() {
  console.log("start")
  const users = await generateUsers(10);
  // console.log(users);
  const data: z.infer<typeof OpportunitySchema> = {
    generalInformation: generateGeneralInformation(users),
    phases: generatePhases(users),
  };
  //console.log(data);
}

async function generateUsers(number: number): Promise<Person[]> {
  const generatedUsers = Array.from({ length: number }, generateUser);
  console.log("Create")
  const result = await db.user.createMany({
    data: generatedUsers,
  });
  console.log(result)
  const users = generatedUsers.map((u) => ({
    id: u.id,
    name: u.name!,
    image: u.image!,
  }));
  return users;
}

const generateUser = () => ({
  id: uuidv4(),
  email: emailUniqueEnforcer.enforce(() => faker.internet.exampleEmail()),
  name: faker.person.fullName(),
  image: faker.image.avatar(),
});

function generateGeneralInformation(generatedUsers: Person[]) {
  const lenght = faker.number.int({ min: 1, max: 4 });
  const start = faker.date.soon({ days: 10, refDate: now });
  const end = new Date(
    start.getTime() +
      faker.number.int({ min: 7, max: 30 }) * 24 * 60 * 60 * 1000,
  );

  return {
    admins: faker.helpers.arrayElements(generatedUsers, lenght),
    title: faker.lorem.word(),
    description: faker.lorem.paragraph(),
    start: start,
    end: end,
  };
}

export function generatePhases(
  generatedUsers: Person[],
): z.infer<typeof PhaseSchema>[] {
  const length = faker.number.int({ min: 2, max: 5 });
  return Array.from({ length: length }, () => generatePhase(generatedUsers));
}

function generatePhase(generatedUsers: Person[]): z.infer<typeof PhaseSchema> {
  return {
    name: faker.word.words(2),
    questionnaires: Array.from(
      { length: faker.number.int({ min: 2, max: 5 }) },
      () => generateQuestionnaire(generatedUsers),
    ),
  };
}

function generateQuestionnaire(
  generatedUsers: Person[],
): z.infer<typeof QuestionnaireSchema> {
  return {
    id: uuidUniqueEnforcer.enforce(() => faker.string.uuid()),
    name: faker.color.human(),
    requiredReviews: faker.number.int({ min: 1, max: 3 }),
    questions: Array.from(
      { length: faker.number.int({ min: 1, max: 5 }) },
      generateQuestion,
    ),
    conditions: [],
    reviewers: faker.helpers.arrayElements(generatedUsers, 2),
  };
}

function generateQuestion(): Question {
  const questionTypes = ["INPUT_TEXT", "DROPDOWN", "CHECKBOXES", "NUMERIC"];
  const questionType = faker.helpers.arrayElement(questionTypes);

  const baseQuestion = {
    label: faker.music.genre(),
    key: keyUniqueEnforcer.enforce(() => faker.word.sample(5)),
    type: questionType,
  };

  return generateQuestionDetails(baseQuestion);
}

function generateQuestionDetails(baseQuestion: {
  label: string;
  key: string;
  type: string;
}): Question {
  switch (baseQuestion.type) {
    case "INPUT_TEXT":
      return {
        ...baseQuestion,
        type: "INPUT_TEXT",
      };

    case "DROPDOWN":
      return {
        ...baseQuestion,
        type: "DROPDOWN",
        options: generateOptions(3),
      };

    case "CHECKBOXES":
      return {
        ...baseQuestion,
        type: "CHECKBOXES",
        options: generateOptions(3),
      };

    case "NUMERIC":
      return {
        ...baseQuestion,
        type: "NUMERIC",
        options: {
          min: 0,
          max: faker.number.int({ min: 1, max: 5 }),
        },
      };

    default:
      throw new Error("Unknown question type");
  }
}

function generateOptions(numberOfOptions: number) {
  return Array.from({ length: numberOfOptions }, () => ({
    id: uuidUniqueEnforcer.enforce(() => faker.string.uuid()),
    text: faker.lorem.word(),
  }));
}

main().catch(console.error);
