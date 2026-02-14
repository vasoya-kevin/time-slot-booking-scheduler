import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(
            "http://localhost:8080/api/v1/auth/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { message: errorData.message || "Registration failed" },
                { status: response.status }
            );
        }

        const result = await response.json();

        // Store token in HTTP-only cookie
        if (result.token) {
            (await cookies()).set("token", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7, // 7 days
            });
        }

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { message: "An error occurred during registration" },
            { status: 500 }
        );
    }
}