import prisma from "database/db";
import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// GET /api/roles/[userId]
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    const { userId } = params;
    let userRoles: UserRole[];

    try {
      const user = await prisma.user.findUnique({
        select: {
          userToUserRoles: {
            select: {
              role: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        where: {
          id: String(userId),
        },
      });

      userRoles = user.userToUserRoles.map((role) => role.role);
    } catch (error) {
      console.log(error);

      return NextResponse.json({ message: "Bad Request." }, { status: 400 });
    }

    return NextResponse.json(userRoles, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
