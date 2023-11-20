import db from "../../../database/db";
import { NextResponse } from "next/server";
import { hash } from 'bcrypt';
import * as z from 'zod';

const userSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters')
  })

export async function POST(req: Request) {
     try {
        const body = await req.json();
        const { email, password } = userSchema.parse(body);

        //check email format
        const existingEmail = await db.user.findUnique({
            where: { email: email }
        });
        if(existingEmail) {
            return NextResponse.json({ user: null, message: "User with this email already exists!"}, 
            { status : 409})
        }

        const hashedPass = await hash(password, 10);
        const newUser = await db.user.create({
            data: {
                email,
                password : hashedPass
            }
        });
        const { password: newUserPassword, ...rest} = newUser;


        return NextResponse.json({ user: rest, message: "Great success!"}, { status : 201 });
    } catch(error) {
      return NextResponse.json({message: "Error!"}, { status : 500});
    }
}