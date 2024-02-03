import { User } from "@prisma/client";

// limit personal data, which is returned
// add required data if neccessary
export interface ReducedUser {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
}

export function toReducedUser(user: User): ReducedUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    image: user.image,
  };
}
