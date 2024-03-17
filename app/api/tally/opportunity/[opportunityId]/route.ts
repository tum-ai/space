import { db } from "server/db";
import { Prisma } from "@prisma/client";
import { env } from "env.mjs";
import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import { Tally, TallyField } from "@lib/types/tally";

export async function POST(
  req: Request,
  { params }: { params: { opportunityId: string } },
) {
  try {
    const tallyApplication = (await req.json()) as Tally;

    if (!isSignatureValidated(req, tallyApplication)) {
      return NextResponse.json(
        { message: "Invalid signature." },
        { status: 401 },
      );
    }

    const { opportunityId } = params;

    const questionnaires = await db.questionnaire.findMany({
      where: {
        phase: { opportunityId: parseInt(opportunityId) },
      },
    });

    // TODO: Check based on opportunity.status e.g. if missing_config then set this?
    //       In this case the status needs to be updated based on if it's currently updated or not
    //       Maybe just add an additional status: awaiting_tally or something
    //       Based on the status this should also not be saved as an application
    //
    // TODO: Strip tallyApplication of actual values and personal data
    await db.opportunity.update({
      where: { id: parseInt(opportunityId) },
      data: { tallySchema: { ...tallyApplication } },
    });

    const application = await db.application.create({
      data: {
        content: tallyApplication,
        opportunity: { connect: { id: parseInt(opportunityId) } },
        questionnaires: {
          connect: questionnaires
            .filter((questionnaire) => {
              if (
                !questionnaire.conditions ||
                (questionnaire.conditions as any[]).length === 0
              ) {
                return true;
              }
              for (const condition of questionnaire.conditions as Pick<
                TallyField,
                "key" | "value"
              >[]) {
                const field = tallyApplication.data.fields.find(
                  (f) => f.key === condition.key,
                );
                if (!field) continue;

                const fieldValue = field.value;
                let conditionMet = false;

                if (isArrayofStrings(fieldValue)) {
                  conditionMet = fieldValue.includes(condition.value as string);
                } else if (typeof fieldValue === "string") {
                  conditionMet = fieldValue === condition.value;
                }

                if (conditionMet) return true;
              }
              return false;
            })
            .map((questionnaire) => ({ id: questionnaire.id })),
        },
      } satisfies Prisma.ApplicationCreateInput,
    });
    return NextResponse.json(application);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while processing the webhook." },
      { status: 500 },
    );
  }
}

function isSignatureValidated(req: Request, webhookPayload: Tally): boolean {
  const receivedSignature = req.headers.get("tally-signature");
  const tallySigningSecret = env.TALLY_SIGNING_SECRET;

  const calculatedSignature = createHmac("sha256", tallySigningSecret)
    .update(JSON.stringify(webhookPayload))
    .digest("base64");

  return receivedSignature === calculatedSignature;
}

function isArrayofStrings(value: any): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}
