import { faker } from "@faker-js/faker";
import { UniqueEnforcer } from "enforce-unique";
import { api } from "trpc/react";

const createUserMutation = api.user.create.useMutation();
const emailUniqueEnforcer = new UniqueEnforcer();

export async function generateUsers(number: number) {
  for (let i = 0; i < number; i++) {
    try {
      const user = generateUser();
      await createUserMutation.mutateAsync(user);
    } catch (error) {
      throw Error("Error while generating mock users.");
    }
  }
}

function generateUser() {
  return {
    email: emailUniqueEnforcer.enforce(() => faker.internet.exampleEmail()),
    name: faker.person.fullName(),
    image: faker.image.avatar(),
  };
}
