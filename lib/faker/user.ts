import { Person } from "@lib/types/person";
import db from "server/db";
import { emailUniqueEnforcer } from "./utils";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

export async function generateUsers(number: number): Promise<Person[]> {
  const generatedUsers = Array.from({ length: number }, () => generateUser());
  await db.user.createMany({
    data: generatedUsers,
  });
  const users = generatedUsers.map((u) => ({
    id: u.id,
    name: u.name!,
    image: u.image!,
  }));
  return users;
}

function generateUser() {
  return {
    id: uuidv4(),
    email: emailUniqueEnforcer.enforce(() => faker.internet.exampleEmail()),
    name: faker.person.fullName(),
    image: faker.image.avatar(),
  };
}
