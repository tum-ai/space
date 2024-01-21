import prisma from "database/db";
import { NextRequest, NextResponse } from "next/server";

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
