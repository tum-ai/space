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

    return await db.application.create({
      data: {
        content: tallyApplication,
        opportunity: { connect: { id: parseInt(opportunityId) } },
        questionnaires: {
          connect: questionnaires
            .filter((questionnaire) => {
              for (const condition of questionnaire.conditions as Pick<
                TallyField,
                "key" | "value"
              >[]) {
                if (
                  tallyApplication.data.fields.find(
                    (field) =>
                      field.key === condition.key &&
                      field.value === condition.value,
                  )
                )
                  return true;
              }

              return false;
            })
            .map((questionnaire) => ({ id: questionnaire.id })),
        },
      } satisfies Prisma.ApplicationCreateInput,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while processing the webhook." },
      { status: 500 },
    );
  }
}

function isSignatureValidated(req: Request, webhookPayload: Tally): boolean {
  const receivedSignature = req.headers.get("tally-signature");
  const tallySigningSecret = env.NEXT_PUBLIC_TALLY_SIGNING_SECRET;

  const calculatedSignature = createHmac("sha256", tallySigningSecret)
    .update(JSON.stringify(webhookPayload))
    .digest("base64");

  return receivedSignature === calculatedSignature;
}
