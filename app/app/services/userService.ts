import { User } from "@prisma/client";
import axios from "axios";

export async function fetchUsers(): Promise<User[]> {
  const res = await axios.get(`api/users`);

  const users = res.data;

  return users;
}
