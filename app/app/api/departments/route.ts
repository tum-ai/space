import { NextRequest, NextResponse } from 'next/server'
import prisma from "database/db";

const completeView = {
    id: true,
    name: true,
    description: true,
    userRole: {
        select: {
            name: true,
        }
    }
}

const partialView = {
    id: true,
    name: true
}


export async function GET(req: NextRequest) {

    let departments;
    const id  = req.nextUrl.searchParams.get('id');
    
    try {
        if (id) {
            departments = await prisma.department.findMany({
                select: completeView
            });
        } else {
            departments = await prisma.department.findMany({
                select: partialView
            });
        }
    } catch (error) {
        return NextResponse.json({"error": error}, { status: 500 })
    }
    

    return NextResponse.json({"departments": departments}, { status: 200 })
};
     