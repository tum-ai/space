import { Application } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// GET /api/tally/[applicationId]
export async function GET(
  req: NextRequest,
  { params }: { params: { applicationId: string } },
) {
  try {
    const { applicationId } = params;
    let readApplication: Application;

    try {
      readApplication = await prisma.application.findUnique({
        where: { id: parseInt(applicationId) },
      });
    } catch (error) {
      console.log(error);

      return NextResponse.json({ message: "Bad Request." }, { status: 400 });
    }

    return NextResponse.json(readApplication, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
