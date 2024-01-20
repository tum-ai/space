import prisma from "database/db";
import { DepartmentMembership } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// GET /api/departmentMemberships
export async function GET() {
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

// POST /api/departmentMemberships
export async function POST(req: NextRequest) {
  try {
    const createFields = await req.json();
    const { userId, departmentId } = createFields;

    const getDepartmentMembershipResponse = await fetch(
      `/api/departmentMemberships/${userId}/${departmentId}`,
    );
    if (getDepartmentMembershipResponse.ok) {
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
