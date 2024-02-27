import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function RandomUUID() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const uuid = uuidv4();

  redirect(`create/${uuid}`);
}
