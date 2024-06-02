import { faker } from "@faker-js/faker";
import db from "server/db";
import { allPersons } from "./mock";
import { Questionnaire } from "@prisma/client";
import { Question } from "@lib/types/question";

interface Review {
  content: Question[];
  userId: string;
  applicationId: number;
  questionnaireId: string;
  status: "CREATED" | "IN_PROGRESS" | "DONE";
}

export async function generateReviews() {
  const applications = await db.application.findMany({
    include: {
      questionnaires: true,
    },
  });
  console.log(applications);
  let reviews: Review[] = [];
  for (const application of applications) {
    for (const questionnaire of application.questionnaires) {
      const numberOfReviews = faker.number.int({
        min: 1,
        max: questionnaire.requiredReviews,
      });
      for (let i = 0; i < numberOfReviews; i++) {
        reviews.push(generateReview(application.id, questionnaire));
      }
    }
  }
  //console.log(reviews);
  await db.review.createMany({ data: reviews });
  return reviews;
}

function generateReview(
  applicationId: number,
  questionnaire: Questionnaire,
): Review {
  return {
    content: generateContent(questionnaire.questions as Question[]),
    userId: faker.helpers.arrayElement(allPersons).id,
    applicationId: applicationId,
    questionnaireId: questionnaire.id,
    status: "DONE",
  };
}

function generateContent(questions: Question[]): Question[] {
  return questions.map((question) => {
    switch (question.type) {
      case "INPUT_TEXT":
        return {
          ...question,
          value: faker.lorem.paragraph(),
        };
      case "DROPDOWN":
        return {
          ...question,
          value: faker.helpers.arrayElement(question.options).text,
        };
      case "CHECKBOXES":
        return {
          ...question,
          value: faker.helpers
            .arrayElements(question.options, {
              min: 0,
              max: question.options.length,
            })
            .map((option) => option.text),
        };
      case "NUMERIC":
        return {
          ...question!,
          value: faker.number.int({
            min: question.options.min,
            max: question.options.max,
          }),
        };
    }
  });
}
