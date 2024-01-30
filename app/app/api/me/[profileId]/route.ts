import { Profile } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import db from "../../../../database/db";

// GET /api/me/[profileId]
export async function GET(
    req: NextRequest,
    { params }: { params: { profileId: string } },
  ) {
    try {
      const { profileId } = params;
      let readProfile: Profile;
  
      try {
        readProfile = await db.profile.findFirstOrThrow({
          where: { id: parseInt(profileId)}
        });
      } catch (error) {
        console.log(error);
  
        return NextResponse.json({ message: "Bad Request." }, { status: 400 });
      }
  
      return NextResponse.json(readProfile, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: "Internal server error." },
        { status: 500 },
      );
    }
  }
