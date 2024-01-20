import prisma from "database/db";
import { DepartmentMembership } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// GET /api/departmentMemberships/[departmentMembershipId]
export async function GET(
  req: NextRequest,
  { params }: { params: { departmentMembershipId: string } },
) {
  try {
    const { departmentMembershipId } = params;
    let readDepartmentMembership: DepartmentMembership;

    try {
      readDepartmentMembership = await prisma.departmentMembership.findUnique({
        where: { id: parseInt(departmentMembershipId) },
      });
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

// PUT /api/departmentMemberships/[departmentMembershipId]
export async function PUT(
  req: NextRequest,
  { params }: { params: { departmentMembershipId: string } },
) {
  try {
    const { departmentMembershipId } = params;
    const updateFields = await req.json();

    let updateDepartmentMembership: DepartmentMembership;

    try {
      updateDepartmentMembership = await prisma.departmentMembership.update({
        where: { id: parseInt(departmentMembershipId) },
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

// DELETE /api/departmentMemberships/[departmentMembershipId]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { departmentMembershipId: string } },
) {
  try {
    const { departmentMembershipId } = params;
    let deleteDepartmentMembership: DepartmentMembership;

    try {
      deleteDepartmentMembership = await prisma.departmentMembership.delete({
        where: { id: parseInt(departmentMembershipId) },
      });
    } catch (error) {
      console.log(error);

      return NextResponse.json({ message: "Bad Request." }, { status: 400 });
    }

    return NextResponse.json(deleteDepartmentMembership, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
