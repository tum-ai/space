import { db } from "server/db";
import { Prisma } from "@prisma/client";
import { env } from "env.mjs";
import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import { Tally } from "@lib/types/tally";
import { connectQuestionnaires } from "server/shared/application";

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

    // TODO: Strip tallyApplication of actual values and personal data
    await db.opportunity.update({
      where: { id: parseInt(opportunityId) },
      data: { tallySchema: { ...tallyApplication } },
    });

    const application = await db.application.create({
      data: {
        content: tallyApplication,
        opportunity: { connect: { id: parseInt(opportunityId) } },
      } satisfies Prisma.ApplicationCreateInput,
    });

    await connectQuestionnaires(application, questionnaires);

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
