import { NextResponse } from 'next/server';
import db from '../../../../database/db';
import { hash } from 'bcrypt';



export default async function POST(req, res) {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        const existingUser = await db.user.findUnique({
            where: { email : email }
        });
        if (!existingUser) {
            return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
        }

        const hashedPassword = await hash(password, 10);

        // const newUser = await db.user.create({
        //     data: {
        //         email: email,
        //         password: hashedPassword
        //         //TODO: add other fields
        //     }
        // });

        return NextResponse.json({ message: 'User created' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}