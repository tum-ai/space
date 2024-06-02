import db from "../../server/db";
import { generateUsers } from "./user";
import { generateOpportunities } from "./opportunities";
import { options } from "./utils";
import { generateApplications } from "./applications";

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
} catch (error) {
  await db.$disconnect();
  console.error(error);
} finally {
  await db.$disconnect();
}
