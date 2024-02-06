//Path api/profiles/[userId]/route.ts:

import { NextRequest, NextResponse } from "next/server";
import prisma from "database/db";
import { authMiddleware } from "middleware";
import { getSession } from "next-auth/react";

export async function GET(req, { params }: { params: { userId: string } }) {
  //_____ auth check _____

  const authCheckResponse = await authMiddleware(req, ["admin"]);
  if (authCheckResponse) return authCheckResponse;

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
  //_____ auth check _____

  const authCheckResponse = await authMiddleware(req, ["admin"]);
  if (authCheckResponse) return authCheckResponse;

  //_____ auth check _____

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
  //_____ auth check _____

  const authCheckResponse = await authMiddleware(req, ["admin"]);
  if (authCheckResponse) return authCheckResponse;

  //_____ auth check _____

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
