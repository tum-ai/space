import prisma from "database/db";
import { Opportunity } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { checkOpportunityPermission } from "lib/auth/checkOpportunitiesPermission";
import { getSession } from "next-auth/react";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

// POST /api/opportunity
export async function POST(req: NextRequest) {
  try {
    //check opportunity permission - not required

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
    //check opportunity permission - Screener, Admin
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if(!checkOpportunityPermission(["screener", "admin"], userId, "all")){
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 403 },
      );
    } 

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
