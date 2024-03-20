import prisma from "server/db";
import { NextRequest, NextResponse } from "next/server";

// GET /api/roles/[userId]
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    if (!params.userId) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 400 },
      );
    }

    const userRoles = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { roles: true },
    });

    return NextResponse.json(userRoles, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
