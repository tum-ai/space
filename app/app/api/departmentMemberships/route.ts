import prisma from "database/db";
import { DepartmentMembership } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { env } from "app/env.mjs";

// POST /api/departmentMemberships
export async function POST(req: NextRequest) {
  try {
    const createFields = await req.json();
    const { userId, departmentId } = createFields;

    const getDepartmentMembershipResponse = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/api/departmentMemberships/userId/${userId}/departmentId/${departmentId}`,
    );
    if (await getDepartmentMembershipResponse.json()) {
      return NextResponse.json(
        { message: "User is already a member of the department." },
        { status: 409 },
      );
    }

    let createDepartmentMembership: DepartmentMembership;

    try {
      createDepartmentMembership = await prisma.departmentMembership.create({
        data: createFields,
      });
    } catch (error) {
      console.log(error);

      return NextResponse.json({ message: "Bad Request." }, { status: 400 });
    }

    return NextResponse.json(createDepartmentMembership, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}

// GET /api/departmentMemberships
export async function GET(req: NextRequest) {
  try {
    let readDepartmentMembership: DepartmentMembership[];

    try {
      readDepartmentMembership = await prisma.departmentMembership.findMany();
    } catch (error) {
      console.log(error);

      return NextResponse.json({ message: "Bad Request." }, { status: 400 });
    }

    return NextResponse.json(readDepartmentMembership, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
