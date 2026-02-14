"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
export async function loginAction(formData: {
    email: string;
    password: string;
}) {
    try {
        const response = await fetch(`${BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || "Login failed",
            };
        }

        const result = await response.json();
        console.log(result, "result")

        // Store token in HTTP-only cookie (more secure)
        if (result.token) {
            (await cookies()).set("token", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7, // 7 days
            });
        }

        return { success: true, data: result };
    } catch (error) {
        return {
            success: false,
            message: "An error occurred during login",
        };
    }
}

export async function registerAction(formData: {
    name: string;
    email: string;
    password: string;
}) {
    try {
        const response = await fetch(
            `${BACKEND_URL}/auth/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                message: errorData.message || "Registration failed",
            };
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

        return { success: true, data: result };
    } catch (error) {
        return {
            success: false,
            message: "An error occurred during registration",
        };
    }
}

export async function logoutAction() {
    (await cookies()).delete("token");
    redirect("/sign-in");
}