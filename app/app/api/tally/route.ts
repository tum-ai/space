import { env } from "app/env.mjs";
import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import {
  FileUploadValue,
  FormField,
  LabelTextPair,
  MatrixValue,
  ParsedFormData,
} from "./routeTypes";

// POST /api/tally
export async function POST(req: Request) {
  try {
    const webhookPayload = await req.json();

    if (isSignatureValidated(req, webhookPayload)) {
      const formData = webhookPayload.data;
      const newFormData = restructureReceivedJSON(formData);
      const newFormDataJSON = JSON.stringify(newFormData);

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

function isSignatureValidated(req: Request, webhookPayload: any): boolean {
  const receivedSignature = req.headers.get("tally-signature");
  const tallySigningSecret = env.NEXT_PUBLIC_TALLY_SIGNING_SECRET;

  const calculatedSignature = createHmac("sha256", tallySigningSecret)
    .update(JSON.stringify(webhookPayload))
    .digest("base64");

  return receivedSignature === calculatedSignature;
}

function restructureReceivedJSON(formData: ParsedFormData): LabelTextPair {
  const newFormData: LabelTextPair = {};

  (formData.fields as FormField[]).forEach((field) => {
    const fieldType = field.type;
    const label = field.label;
    let text: string | string[] | LabelTextPair;

    if (
      fieldType === "MULTIPLE_CHOICE" ||
      fieldType === "CHECKBOXES" ||
      fieldType === "DROPDOWN" ||
      fieldType === "MULTI_SELECT" ||
      fieldType === "RANKING"
    ) {
      text = handleChoiceField(field);
    } else if (fieldType === "FILE_UPLOAD" || fieldType === "SIGNATURE") {
      text = handleFileUploadField(field);
    } else if (fieldType === "MATRIX") {
      text = hanldeMatrixField(field);
    } else {
      text = field.value.toString();
    }

    newFormData[label] = text;
  });

  return newFormData;
}

function handleChoiceField(field: FormField): string | string[] {
  if (typeof field.value === "boolean") {
    return field.value.toString();
  } else {
    return field.options
      .filter((option) => (field.value as string[]).includes(option.id))
      .map((option) => option.text);
  }
}

function handleFileUploadField(field: FormField): string[] {
  return (field.value as FileUploadValue[]).map((file) => file.url.toString());
}

function hanldeMatrixField(field: FormField): LabelTextPair {
  let matrixRowColumnsPairs: LabelTextPair = {};

  Object.entries(field.value as MatrixValue).forEach(([key, value]) => {
    const row = field.rows.find((row) => row.id === key);
    const rowLabel = row.text;

    let labelsOfColumns: string[] = [];

    value.forEach((columnId) => {
      const column = field.columns.find((column) => column.id === columnId);
      const columnLabel = column.text;

      labelsOfColumns.push(columnLabel);
    });

    matrixRowColumnsPairs[rowLabel] = labelsOfColumns;
  });

  return matrixRowColumnsPairs;
}
