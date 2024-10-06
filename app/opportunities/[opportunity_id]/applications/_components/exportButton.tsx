"use client";

import { Button } from "@components/ui/button";
import { FileDown } from "lucide-react";
import { JsonValue } from "next-auth/adapters";
import { toast } from "sonner";

export const ExportButton = ({
  getExportData,
}: {
  getExportData: () => Promise<
    {
      content: JsonValue;
      reviews: {
        content: JsonValue;
      }[];
    }[]
  >;
}) => {
  const exportApplications = async (): Promise<void> => {
    try {
      const data = await getExportData();
      const jsonString = JSON.stringify(data);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "Applications";
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Button
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={async () => {
        const toastId = toast.loading("Exporting applications...");
        try {
          await exportApplications();
          toast.success("Exported applications", { id: toastId });
        } catch (err) {
          toast.error("Failed to export applications", { id: toastId });
        }
      }}
    >
      <FileDown className="mr-2" />
      Export
    </Button>
  );
};
