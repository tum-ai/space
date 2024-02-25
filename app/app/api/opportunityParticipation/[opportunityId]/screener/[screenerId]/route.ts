import prisma from "server/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET opportunityParticipation/[opportunityId]/screener/[screenerId]
 *
 * @param NextRequest request
 * @param number opportunityId
 * @param number screenerId
 * @returns user screener
 */
export const GET = async (
  request: NextRequest,
  { params: { opportunityId, screenerId } },
): Promise<NextResponse> => {
  const readScreenerById = await prisma.opportunityParticipation
    .findUnique({
      where: {
        opportunityParticipationId: {
          opportunityId: parseInt(opportunityId),
          userId: screenerId,
        },
        role: "screener",
      },
    })
    .catch((error) => {
      console.log(error);
      return NextResponse.json(
        { Error: "Internal Server Error" },
        { status: 500 },
      );
    });

  const responseBody = readScreenerById ?? {
    Error: "Bad request. This screener does not exist.",
  };
  const status = readScreenerById === null ? 400 : 200;

  return NextResponse.json(responseBody, { status });
};

/**
 * PUT opportunityParticipation/[opportunityId]/screener/[screenerId]
 *
 * @param NextRequest request
 * @param number opportunityId
 * @param number screenerId
 * @returns user screener
 */
export const PUT = async (
  request: NextRequest,
  { params: { opportunityId, screenerId } },
): Promise<NextResponse> => {
  const { newRole } = await request.json();

  const updateScreener = await prisma.opportunityParticipation
    .update({
      where: {
        opportunityParticipationId: {
          opportunityId: parseInt(opportunityId),
          userId: screenerId,
        },
        role: "screener",
      },
      data: {
        role: newRole,
      },
    })
    .catch((error) => {
      console.log(error);
      return NextResponse.json(
        { Error: "Internal Server Error" },
        { status: 500 },
      );
    });

  const responseBody = updateScreener ?? {
    Error: "Bad request. This screener does not exist.",
  };
  const status = updateScreener === null ? 400 : 200;

  return NextResponse.json(responseBody, { status });
};
