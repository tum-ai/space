"use client";

import { Button } from "@components/ui/button";
import { Plus } from "lucide-react";
import { api } from "trpc/react";

/**
 *  A button for exporting all reviews and applications for a particular opportunity
 *
 * @param opportunityId
 * @param opportunityTitle
 * @returns ExportButton
 */
export const ExportButton = ({
  opportunityId,
  opportunityTitle,
}: {
  opportunityId: number;
  opportunityTitle: string;
}) => {
  const query = api.application.getReviewsWithApplications.useQuery(
    { id: opportunityId },
    { refetchOnMount: false },
  );

  const exportApplications = async () => {
    try {
      await query.refetch();
      const jsonString = JSON.stringify(query.data);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${opportunityTitle} Applications`;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Button className="" onClick={exportApplications}>
      <Plus className="mr-2" />
      Export Data
    </Button>
  );
};
