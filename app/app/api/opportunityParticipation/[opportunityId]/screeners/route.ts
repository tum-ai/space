import prisma from "database/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params: { opportunityId } },
): Promise<NextResponse> {
  const screeners = await prisma.opportunityParticipation
    .findMany({
      where: {
        opportunityId: parseInt(opportunityId),
        role: "screener",
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

export async function POST(
  request: NextRequest,
  { params: { opportunityId } },
): Promise<NextResponse> {
  const { userId } = await request.json();

  const createScreener = await prisma.opportunityParticipation
    .create({
      data: {
        userId: userId,
        opportunityId: parseInt(opportunityId),
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

  return NextResponse.json(createScreener, { status: 200 });
}