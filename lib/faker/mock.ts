import db from "../../server/db";
import { generateUsers } from "./user";
import { generateOpportunities } from "./opportunities";
import { fetchAllUsers, options } from "./utils";
import { generateApplications } from "./applications";
import { connectQuestionnaires } from "server/shared/application";
import { type Person } from "@lib/types/person";
import { generateReviews } from "./reviews";

const numberOfOpportunities = parseInt(options.opportunities, 10);
const numberOfUsers = parseInt(options.users, 10);
export let allPersons: Person[];

try {
  await db.$connect;

  // generate Users
  const generatedUsers = await generateUsers(numberOfUsers);
  console.log(
    `${numberOfUsers} users generated:`,
    generatedUsers.map((u) => u.name),
  );

  const allUsers = await fetchAllUsers();
  allPersons =
    allUsers?.map((user) => ({
      id: user.id,
      name: user.name!,
      image: user.image!,
    })) || [];

  // generate opportunities
  const opportunities = await generateOpportunities(numberOfOpportunities);
  console.log(
    `${numberOfOpportunities} opportunities generated:`,
    opportunities.map((o) => o.generalInformation.title),
  );

  const opportunityIds = opportunities.map((o) => o.id);

  // generate applications
  const applications = await generateApplications(opportunityIds);
  console.log(
    `${applications.length} applications generated:`,
    applications.map((a) => a.content.eventId),
  );

  // connect applications to questionnaires
  for (const o of opportunities) {
    const [apps, questionnaires] = [
      await db.application.findMany({
        where: { opportunityId: o.id },
      }),
      await db.questionnaire.findMany({
        where: { phase: { opportunityId: o.id } },
      }),
    ];

    apps.forEach(async (a) => {
      console.log(
        `Connecting application with ID ${a.id} to questionnaires of opportunity with ID: ${o.id}`,
      );
      await connectQuestionnaires(a, questionnaires);
    });
  }

  // generate reviews
  const reviews = await generateReviews();
  console.log(
    `${reviews.length} reviews generated: `,
    reviews.map((r) => ({
      userId: r.userId,
      applicationId: r.applicationId,
      questionnaireId: r.questionnaireId,
    })),
  );
} catch (error) {
  await db.$disconnect();
  console.error(error);
} finally {
  await db.$disconnect();
}
