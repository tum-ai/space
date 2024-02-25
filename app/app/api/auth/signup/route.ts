import { NextResponse } from "next/server";
import db from "../../../../server/db";
import { hash } from "bcrypt";

interface CreateAccountBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export async function POST(req: Request) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { firstName, lastName, email, password }: CreateAccountBody =
    await req.json();

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
      role: "USER",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _newUserPassword, ...rest } = newUser;

  return NextResponse.json({ user: rest, message: "Success" }, { status: 201 });
}
