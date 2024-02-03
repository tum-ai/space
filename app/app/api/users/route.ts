import { NextRequest, NextResponse } from "next/server";
import prisma from "database/db";
import { toReducedUser } from "@models/user";

// GET /api/users
export async function GET(req: NextRequest) {
  try {
    // Keep user data safe and secure
    const users = (await prisma.user.findMany()).map(toReducedUser);

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
