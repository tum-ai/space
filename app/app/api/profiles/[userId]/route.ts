//Path api/profiles/[userId]/route.ts:

import { NextRequest, NextResponse } from "next/server";
import prisma from "database/db";
import { checkPermission } from "lib/auth/checkUserPermission";
import { getSession } from "next-auth/react";

export async function GET(req, { params }: { params: { userId: string } }) {
  //_____ auth check _____
  // maybe move everything of auth check into seperate file

  const session = await getSession({ req });
  // const authUserId = session?.user?.id;
  const authUserId = session?.user?.id;

  //maybe exclude that check because the middleware already checks for auth
  if (!authUserId) {
    return NextResponse.json(
      { error: "You need to be logged in to view this page" },
      { status: 401 },
    );
  }

  const permissionGranted = await checkPermission(
    ["admin", "member"],
    authUserId,
  );


  if (!permissionGranted) {
    return NextResponse.json(
      { error: "You don't have permission to view this page" },
      { status: 403 },
    );
  }

  //_____ auth check _____

  const { userId } = params; // Get userId from URL
  let profile;

  try {
    profile = await prisma.user.findUnique({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        userToUserRoles: {
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
        image: true,
        departmentMemberships: {
          select: {
            department: {
              select: {
                id: true,
                name: true,
              },
            },
            departmentPosition: true,
            membershipEnd: true,
            membershipStart: true,
          },
        },
      },
      where: {
        id: userId,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }

  return NextResponse.json({ profile: profile }, { status: 200 });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  const body = await req.json(); // Get request body
  const { userId } = params; // Get userId from URL

  let updatedProfile;

  try {
    updatedProfile = await prisma.user.update({
      where: {
        id: userId,
      },
      data: body, // Update profile with request body
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }

  return NextResponse.json({ profile: updatedProfile }, { status: 200 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  const { userId } = params; // Get userId from URL
  let deletedProfile;

  try {
    deletedProfile = await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }

  return NextResponse.json({ profile: deletedProfile }, { status: 200 });
}
