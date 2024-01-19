import prisma from "database/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params: { opportunityId, adminId } },
): Promise<NextResponse> => {
  const readAdminById = await prisma.opportunityParticipation
    .findUnique({
      where: {
        opportunityParticipationId: {
          opportunityId: parseInt(opportunityId),
          userId: adminId,
        },
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

  const responseBody = readAdminById ?? {
    Error: "Bad request. This admin does not exist.",
  };
  const status = readAdminById === null ? 400 : 200;

  return NextResponse.json(responseBody, { status });
};

export const PUT = async (
  request: NextRequest,
  { params: { opportunityId, adminId } },
): Promise<NextResponse> => {
  const { newRole } = await request.json();

  const updateAdmin = await prisma.opportunityParticipation
    .update({
      where: {
        opportunityParticipationId: {
          opportunityId: parseInt(opportunityId),
          userId: adminId,
        },
        role: "admin",
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

  const responseBody = updateAdmin ?? {
    Error: "Bad request. This admin does not exist.",
  };
  const status = updateAdmin === null ? 400 : 200;

  return NextResponse.json(responseBody, { status });
};
