import { faker } from "@faker-js/faker";
import { EnforceUniqueError, UniqueEnforcer } from "enforce-unique";
import { api } from "trpc/react";

const now = new Date();
const keyUniqueEnforcer = new UniqueEnforcer();
const uuidUniqueEnforcer = new UniqueEnforcer();

const createOpportunityMutation = api.opportunity.create.useMutation();
const updateOpportunityMutation = api.opportunity.update.useMutation();

async function generateOpportunities(number: number) {
	for (let i = 0; i < number; i++) {
		const 
		try {
			await createOpportunityMutation.mutateAsync(generateOpportunityGeneralInformation());
			await updateOpportunityMutation.mutateAsync();
		} catch (error) {
			throw Error("Error while generating mock data")
		}
	}
}

function generateOpportunityGeneralInformation() {
  const lenght = faker.number.int({ min: 1, max: 4 })
  return {
    admins: Array.from({ length }, () => faker.string.uuid()), // TODO: profiles do not exist
    title: faker.lorem.word(),
    description: faker.lorem.paragraph(),
    start: now.setDate(1),
    end: now.setDate(20),
  };
}

function generateOpportunityPhase() {
  return {
    name: faker.word.words(2),
    questionnaires: Array.from(
      { length: faker.number.int({ min: 2, max: 5 }) },
      generateQuestionnaire,
    ),
  };
}

function generateQuestionnaire() {
  return {
    name: faker.color.human(),
    requiredReviews: faker.number.int({ min: 1, max: 3 }),
	questions: Array.from({ length: faker.number.int({min: 1, max: 5}) }, generateQuestion),
	conditions: "", // TODO
	// reviewers: Array.from(),
  };
}

function generateQuestion() {
  const questionTypes = ["INPUT_TEXT", "DROPDOWN", "CHECKBOXES", "NUMERIC"];
  const questionType = faker.helpers.arrayElement(questionTypes);

  const baseQuestion = {
    label: faker.music.genre(),
    key: keyUniqueEnforcer.enforce(() => faker.word.sample(5)),
    type: questionType
  };

  return generateQuestionDetails(baseQuestion);
}

function generateQuestionDetails(baseQuestion: {label: string, key: string, type: string}) {
  switch (baseQuestion.type) {
    case "INPUT_TEXT":
      return baseQuestion;
    case "DROPDOWN":
    case "CHECKBOXES":
      return {
        ...baseQuestion,
        options: generateOptions(3)
      };
    case "NUMERIC":
      return {
        ...baseQuestion,
        options: {
          min: 0,
          max: faker.number.int({ min: 1, max: 5 })
        }
      };
    default:
      throw new Error("Unknown question type");
  }
}

function generateOptions(numberOfOptions: number) {
  return Array.from({ length: numberOfOptions }, () => ({
    id: faker.string.uuid(),
    text: faker.lorem.word(),
  }));
}

