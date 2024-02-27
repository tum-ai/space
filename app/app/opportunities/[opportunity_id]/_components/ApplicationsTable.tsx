import { Application } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { api } from "trpc/react";

export const columns: ColumnDef<Application>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];

interface ApplicationsTableProps {
  opportunity_id: number;
}

export const ApplicationsTable = ({
  opportunity_id,
}: ApplicationsTableProps) => {
  const searchParams = useSearchParams();
  const { data, error } = api.application.getAllByOpportunityId.useQuery({
    opportunityId: opportunity_id,
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return <>asd</>;
};
