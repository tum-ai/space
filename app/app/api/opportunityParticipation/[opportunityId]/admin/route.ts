import prisma from "server/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET opportunityParticipation/[opportunityId]/admin
 *
 * @param NextRequest request
 * @param number opportunityId
 * @returns user[] admins
 */
export const GET = async (
  request: NextRequest,
  { params: { opportunityId } },
): Promise<NextResponse> => {
  const admins = await prisma.opportunityParticipation
    .findMany({
      where: {
        opportunityId: parseInt(opportunityId),
        role: "admin",
      },
    })
    .catch((error: Error) => {
      console.log(error);
      return NextResponse.json(
        { Error: "Internal Server Error" },
        { status: 500 },
      );
    });

  return NextResponse.json({ admins }, { status: 200 });
};

/**
 * POST opportunityParticipation/[opportunityId]/admin
 *
 * @param NextRequest request
 * @param number opportunityId
 * @param json userId
 * @returns user admin
 */
export const POST = async (
  request: NextRequest,
  { params: { opportunityId } },
): Promise<NextResponse> => {
  const { userId } = await request.json();

  const createAdmin = await prisma.opportunityParticipation
    .create({
      data: {
        userId: userId,
        opportunityId: parseInt(opportunityId),
        role: "admin",
      },
    })
    .catch((error) => {
      console.log(error);
      return NextResponse.json(
        { Error: "Internal Server Error" },
        { status: 500 },
      );
    });

  return NextResponse.json(createAdmin, { status: 200 });
};
