import prisma from "database/db";
import { DepartmentMembership } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// PUT /api/departmentMemberships/[departmentMembershipId]
export async function PUT(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = parseInt(searchParams.get("departmentMembershipId"));
    const updateFields = await req.json();
    let updateDepartmentMembership: DepartmentMembership;

    try {
      updateDepartmentMembership = await prisma.departmentMembership.update({
        where: { id },
        data: updateFields,
      });
    } catch (error) {
      console.log(error);

      return NextResponse.json({ message: "Bad Request." }, { status: 400 });
    }

    return NextResponse.json(updateDepartmentMembership, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
