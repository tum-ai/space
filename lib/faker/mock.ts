import db from "../../server/db";
import { generateUsers } from "./user";
import { generateOpportunities } from "./opportunities";
import { options } from "./utils";
import { generateApplications } from "./applications";
import { connectQuestionnaires } from "server/shared/application";

const numberOfOpportunities = parseInt(options.opportunities, 10);
const numberOfUsers = parseInt(options.users, 10);

try {
  await db.$connect;

  const generatedUsers = await generateUsers(numberOfUsers);
  console.log(
    `${numberOfUsers} users generated:`,
    generatedUsers.map((u) => u.name),
  );

  const opportunities = await generateOpportunities(numberOfOpportunities);
  console.log(
    `${numberOfOpportunities} opportunities generated:`,
    opportunities.map((o) => o.generalInformation.title),
  );

  const opportunityIds = opportunities.map((o) => o.id!);

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
} catch (error) {
  await db.$disconnect();
  console.error(error);
} finally {
  await db.$disconnect();
}
