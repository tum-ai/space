import { NextRequest, NextResponse } from "next/server";
import prisma from "server/db";

const complete_view = {
  name: true,
  users: {
    select: {
      id: true,
    },
  },
};

const partial_view = {
  name: true,
};

export async function GET(req: NextRequest) {
  let permissions;
  const id = req.nextUrl.searchParams.get("id");

  try {
    if (id) {
      permissions = await prisma.userRole.findMany({
        select: complete_view,
      });
    } else {
      permissions = await prisma.userRole.findMany({
        select: partial_view,
      });
    }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }

  return NextResponse.json({ roles: permissions }, { status: 200 });
}
