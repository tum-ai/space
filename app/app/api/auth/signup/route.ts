import { NextResponse } from 'next/server';
import db from '../../../../database/db';
import { hash } from 'bcrypt';

export async function POST(req: Request) {
    try {
       const { email, password } = await req.json();

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