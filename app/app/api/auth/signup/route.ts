import { NextResponse } from "next/server";
import db from "../../../../database/db";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password } = await req.json();

    //check email format
    const existingEmail = await db.user.findUnique({
      where: { email: email },
    });
    if (existingEmail) {
      return NextResponse.json(
        { user: null, message: "User with this email already exists!" },
        { status: 409 },
      );
    }

    //hash password for security
    const hashedPass = await hash(password, 10);
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPass,
        firstName,
        lastName,
      },
    });
    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json(
      { user: rest, message: "Success" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
