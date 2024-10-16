import { faker } from "@faker-js/faker";
import db from "server/db";
import { keyUniqueEnforcer, now, options, uuidUniqueEnforcer } from "./utils";
import { type Question } from "@lib/types/question";
import {
  type GeneralInformation,
  type Phase,
  type Questionnaire,
} from "@lib/types/opportunity";
import { allPersons } from "./mock";

const minNumberOfPhases = parseInt(options.minphases, 10);
const maxNumberOfPhases = parseInt(options.maxphases, 10);
const minNumberOfQuestionnaires = parseInt(options.minquestionnaires, 10);
const maxNumberOfQuestionnaires = parseInt(options.maxquestionnaires, 10);

export async function generateOpportunities(number: number) {
  const opportunities = Array.from({ length: number }, () =>
    generateOpportunity(),
  );

  for (const opportunity of opportunities) {
    await db.opportunity.create({
      data: {
        id: opportunity.id,
        title: opportunity.generalInformation.title,
        description: opportunity.generalInformation.description,
        start: opportunity.generalInformation.start,
        end: opportunity.generalInformation.end,
        admins: {
          connect: opportunity.generalInformation.admins.map((admin) => ({
            id: admin.id,
          })),
        },
        phases: {
          create: opportunity.phases.map((phase) => ({
            name: phase.name,
            order: phase.order,
            questionnaires: {
              create: phase.questionnaires.map((questionnaire) => ({
                id: questionnaire.id,
                name: questionnaire.name,
                requiredReviews: questionnaire.requiredReviews,
                questions: questionnaire.questions,
                reviewers: {
                  connect: questionnaire.reviewers.map((reviewer) => ({
                    id: reviewer.id,
                  })),
                },
              })),
            },
          })),
        },
      },
    });
  }

  return opportunities;
}

function generateOpportunity() {
  return {
    id: uuidUniqueEnforcer.enforce(() => faker.number.int({ max: 9999999 })),
    generalInformation: generateGeneralInformation(),
    phases: generatePhases(),
  };
}

function generateGeneralInformation(): GeneralInformation {
  const start = faker.date.soon({ days: 10, refDate: now });
  const end = new Date(
    start.getTime() +
      faker.number.int({ min: 7, max: 30 }) * 24 * 60 * 60 * 1000,
  );

  return {
    admins: allPersons,
    title: faker.lorem.word(),
    description: faker.lorem.paragraph(),
    start: start,
    end: end,
  };
}

export function generatePhases(): Phase[] {
  const length = faker.number.int({
    min: minNumberOfPhases,
    max: maxNumberOfPhases,
  });
  return Array.from({ length: length }, () => generatePhase());
}

function generatePhase(): Phase {
  return {
    id: uuidUniqueEnforcer.enforce(() => faker.string.uuid()),
    name: faker.word.words(2),
    order: faker.number.int({ min: 1, max: 10 }),
    isInterview: false,
    questionnaires: Array.from(
      {
        length: faker.number.int({
          min: minNumberOfQuestionnaires,
          max: maxNumberOfQuestionnaires,
        }),
      },
      () => generateQuestionnaire(),
    ),
  };
}

function generateQuestionnaire(): Questionnaire {
  return {
    id: uuidUniqueEnforcer.enforce(() => faker.string.uuid()),
    name: faker.color.human(),
    requiredReviews: faker.number.int({ min: 1, max: 3 }),
    questions: Array.from(
      { length: faker.number.int({ min: 3, max: 5 }) },
      generateQuestion,
    ),
    conditions: [],
    reviewers: allPersons,
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
