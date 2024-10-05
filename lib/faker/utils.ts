import { UniqueEnforcer } from "enforce-unique";
import { Command } from "commander";
import db from "server/db";

// Unique Enforcers
export const emailUniqueEnforcer = new UniqueEnforcer();
export const keyUniqueEnforcer = new UniqueEnforcer();
export const uuidUniqueEnforcer = new UniqueEnforcer();

// Command-line options
export const program = new Command();

program
  .option("-u, --users <number>", "number of users to generate", "5")
  .option(
    "-o, --opportunities <number>",
    "number of opportunities to generate",
    "2",
  )
  .option(
    "-minp, --minphases <number>",
    "minimal number of phases to generate per opportunity",
    "2",
  )
  .option(
    "-maxp, --maxphases <number>",
    "maximal number of phases to generate per opportunity",
    "4",
  )
  .option(
    "-minq, --minquestionnaires <number>",
    "minimal number of questionnaires to generate per phase",
    "1",
  )
  .option(
    "-maxq, --maxquestionnaires <number>",
    "maximal number of questionnaires to generate per phase",
    "3",
  )
  .option(
    "-mina, --minapplications <number>",
    "minimal number of applications to generate per opportunity",
    "1",
  )
  .option(
    "-maxa, --maxapplications <number>",
    "maximal number of applications to generate per opportunity",
    "5",
  )
  .parse(process.argv);

export const options = program.opts();
export const now = new Date();

export async function fetchAllUsers() {
  try {
    const users = await db.user.findMany();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}
