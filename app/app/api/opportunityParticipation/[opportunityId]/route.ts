import prisma from "database/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET opportunityParticipation/[opportunityId]
 *
 * @param NextRequest request
 * @param number opportunityId
 * @returns User[]
 */
export async function GET(
  request: NextRequest,
  { params: { opportunityId } },
): Promise<NextResponse> {
  const screeners = await prisma.opportunityParticipation
    .findMany({
      where: {
        opportunityId: parseInt(opportunityId),
      },
    })
    .catch((error: Error) => {
      console.log(error);
      return NextResponse.json(
        { Error: "Internal Server Error" },
        { status: 500 },
      );
    });

  return NextResponse.json({ screeners }, { status: 200 });
}
