import { type User } from "@prisma/client";

export interface LogEntry {
  user: User;
  date: Date;
}
