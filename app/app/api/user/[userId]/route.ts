import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import db from "../../../../database/db";

// GET /api/user/[userId]
export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } },
  ) {
    try {
      const { userId } = params;
      let readUser: {
        id: string;
        profileId: number | null;
        firstName: string | null;
        lastName: string | null;
        email: string;
      };
  
      try {
        readUser = await db.user.findFirstOrThrow({
          where: { id: userId},
          select: {
            id: true,
            profileId: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        });
      } catch (error) {
        console.log(error);
  
        return NextResponse.json({ message: "Bad Request." }, { status: 400 });
      }
  
      return NextResponse.json(readUser, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: "Internal server error." },
        { status: 500 },
      );
    }
  }
