import { redirect } from "next/navigation";
import { getServerAuthSession } from "server/auth";
import CreateOpportunityForm from "./createOpportunityForm";

export default async function CreateOpportunity() {
  const session = await getServerAuthSession();

  if (!session?.user.id) redirect("/auth");

  return <CreateOpportunityForm session={session} />;
}
