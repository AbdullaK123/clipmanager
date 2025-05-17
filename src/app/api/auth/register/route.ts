import { NextRequest, NextResponse } from "next/server";
import { db } from '@/app/lib/prisma'
import bcrypt from "bcryptjs";
import { passwordStrength } from "check-password-strength";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(request: NextRequest) {

    try {

        const registerFormData = await request.json()

        if (!registerFormData.email) {
            return NextResponse.json(
                {"message": "Invalid request body. Email is a required field!"},
                {status: 400}
            )
        }
    
        if (!registerFormData.password) {
            return NextResponse.json(
                {"message": "Invalid request body. Password is a required field!"},
                {status: 400}
            )
        }
    
        if (!emailRegex.test(registerFormData.email)) {
            return NextResponse.json(
                {"message": "Email input is not an email address!"},
                {status: 400}
            )
        }
    
        if (passwordStrength(registerFormData.password).id < 2) {
            return NextResponse.json(
                {"message": "Password is too weak!"},
                {status: 400}
            )
        }
    
        const existingUser = await db.user.findUnique({
            'where': {
                'email': registerFormData.email
            }
        })
    
        if (existingUser) {
            return NextResponse.json(
                {"message": "User already exists!"},
                {status: 409}
            )
        }
    
        const userToBeAdded = {
            name: registerFormData.name || "User",
            email: registerFormData.email,
            hashedPassword: bcrypt.hashSync(registerFormData.password, 10)
        }

        const user = await db.user.create({
            data: userToBeAdded
        })

        const { hashedPassword: _, ...userWithoutPassword } = user;

        return NextResponse.json(
            {
                "message": "User created successfully!",
                "user": userWithoutPassword
            },
            {status: 201}
        )
    } catch (error) {

        console.error('Error creating user: ', error);

        if (error instanceof SyntaxError) {
            return NextResponse.json(
                {"message": `Invalid JSON in request body: ${error instanceof Error ? error.message : error }`},
                {status: 400}
            )
        }
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            return NextResponse.json(
                {"message": "User already exists!"},
                {status: 409}
            );
        }
        return NextResponse.json(
            {"message": `Error creating user: ${ error instanceof Error ? error.message : error }`},
            {status: 500}
        )
    }
}