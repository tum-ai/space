"use client";

import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Copy, Send } from "lucide-react";
import { toast } from "sonner";
import { api } from "trpc/react";
import { type Tally } from "@lib/types/tally";
import { TallyFieldForm } from "./tallyFieldForm";
import { useEffect, useState } from "react";
import { Label } from "@components/ui/label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@components/ui/resizable";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";

export const TallyForm = ({ opportunityId }: { opportunityId: number }) => {
  const { data } = api.opportunity.getTallySchema.useQuery({
    id: Number(opportunityId),
  });

  const applicationFields = (data?.tallySchema as Tally)?.data?.fields ?? [];
  const [webhookUrl, setWebhookUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWebhookUrl(
        `${window.location.origin}/api/tally/opportunity/${opportunityId}`,
      );
    }
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="w-full space-y-2">
        <Label>Webhook url</Label>
        <div className="flex w-full gap-2">
          <Input type="text" readOnly value={webhookUrl} />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => {
              toast.promise(navigator.clipboard.writeText(webhookUrl), {
                loading: "Copying to clipboard",
                success: "Copied to clipboard",
                error: "Failed to copy to clipboard",
              });
            }}
          >
            <Copy />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Set this Webhook url in Tally to receive the applications
        </p>
      </div>

      {!applicationFields.length && (
        <div className="overflow-x-auto">
          <Alert className="w-max">
            <Send className="h-4 w-4" />
            <AlertTitle>Send a Test application</AlertTitle>
            <AlertDescription>
              Submit a test application to see it here and configure the
              assignment of questionnaires
            </AlertDescription>
          </Alert>
        </div>
      )}

      {!!applicationFields.length && (
        <div className="h-[80vh]">
          <ResizablePanelGroup
            direction="horizontal"
            autoSaveId="tallyform-config"
            className="gap-4"
          >
            <ResizablePanel defaultSize={50}>
              <Card className="h-full overflow-y-scroll">
                <CardHeader>
                  <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    Assignment rules
                  </CardTitle>
                  <CardDescription>
                    Define rules to decide which questionnaires to assign to an
                    application
                  </CardDescription>
                </CardHeader>
              </Card>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <Card className="h-full overflow-y-scroll">
                <CardHeader>
                  <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight">
                    Application Form
                  </CardTitle>
                  {applicationFields.length === 0 && (
                    <CardDescription>
                      Your application schema will show up here once you submit
                      a test application
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="sticky grid gap-8">
                    {applicationFields.map((field) => (
                      <TallyFieldForm field={field} key={field.key} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
    </div>
  );
};
