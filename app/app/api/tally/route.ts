import { env } from "app/env.mjs";
import { createHmac } from "crypto";
import { NextResponse } from "next/server";

type ParsedFormData = {
  responseId: string;
  submissionId: string;
  respondentId: string;
  formId: string;
  formName: string;
  createdAt: Date;
  fields: FormField[];
};

type FormField = {
  key: string;
  label: string;
  type:
    | "HIDDEN_FIELDS"
    | "CALCULATED_FIELDS"
    | "INPUT_TEXT"
    | "INPUT_NUMBER"
    | "INPUT_EMAIL"
    | "INPUT_PHONE_NUMBER"
    | "INPUT_LINK"
    | "INPUT_DATE"
    | "INPUT_TIME"
    | "TEXTAREA"
    | "MULTIPLE_CHOICE";
  value: number | string | boolean | string[] | FileUploadValue[];
  options?: MultipleChoiceOption[];
};

type FileUploadValue = {
  id: string;
  name: string;
  url: URL;
  // TODO: Define MIME types.
  mimeType: string;
  size: number;
};

type MultipleChoiceOption = {
  id: string;
  text: string;
};

// POST /api/tally
export async function POST(req: Request) {
  try {
    const webhookPayload = await req.json();
    const receivedSignature = req.headers.get("tally-signature");
    const tallySigningSecret = env.NEXT_PUBLIC_TALLY_SIGNING_SECRET;

    const calculatedSignature = createHmac("sha256", tallySigningSecret)
      .update(JSON.stringify(webhookPayload))
      .digest("base64");

    if (receivedSignature === calculatedSignature) {
      const formData = webhookPayload.data;
      const parsedFormData: ParsedFormData = {
        responseId: formData.responseId,
        submissionId: formData.submissionId,
        respondentId: formData.respondentId,
        formId: formData.formId,
        formName: formData.formName,
        createdAt: formData.createdAt,
        fields: formData.fields,
      };

      return NextResponse.json(
        { message: "Webhook received and processed successfully." },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { message: "Invalid signature." },
        { status: 401 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while processing the webhook." },
      { status: 500 },
    );
  }
}
