import prisma from "server/db";
import { Opportunity } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// POST /api/opportunity
export async function POST(req: NextRequest) {
  try {
    const createFields = await req.json();

    let createOpportunity: Opportunity;

    try {
      createOpportunity = await prisma.opportunity.create({
        data: createFields,
      });
    } catch (error) {
      console.log(error);

      return NextResponse.json({ message: "Bad Request." }, { status: 400 });
    }

    return NextResponse.json(createOpportunity, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

// GET /api/opportunity
export async function GET(req: NextRequest) {
  try {
    let readOpportunity: Opportunity[];

    try {
      readOpportunity = await prisma.opportunity.findMany();
    } catch (error) {
      console.log(error);

      return NextResponse.json({ message: "Bad Request." }, { status: 400 });
    }

    return NextResponse.json(readOpportunity, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
