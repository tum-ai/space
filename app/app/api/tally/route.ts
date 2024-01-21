import prisma from "database/db";
import { Application } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// GET /api/tally
export async function GET(req: NextRequest) {
  try {
    let readApplcation: Application[];

    try {
      readApplcation = await prisma.application.findMany();
    } catch (error) {
      console.log(error);

      return NextResponse.json({ message: "Bad Request." }, { status: 400 });
    }

    return NextResponse.json(readApplcation, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while processing the webhook." },
      { status: 500 },
    );
  }
}
