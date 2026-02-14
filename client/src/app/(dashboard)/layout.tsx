import { Container } from "@/components/common";
import { Button } from "@/components/ui/button";
import React from "react";
import { logoutAction } from "../actions/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export async function getProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/sign-in");
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        cache: "no-store",
      },
    );

    if (!res.ok) {
      console.error("Failed to fetch profile:", res.status);
      redirect("/sign-in");
    }

    const data = await res.json();
    return data.user;
  } catch (error) {
    console.error("Profile fetch error:", error);
    redirect("/sign-in");
  }
}

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
  const user = await getProfile();
  return (
    <>
      <header className="font-sans h-16 border-b border-black/10 w-full shadow-lg">
        <nav className="max-w-7xl w-full mx-auto flex items-center justify-between h-full px-4">
          <h1 className="text-2xl font-bold">Scheduling Dashboard</h1>
          <div className="flex gap-6 items-center">
            <h2 className="text-sm font-semibold">Welcome, {user.name}!</h2>
            <form action={logoutAction}>
              <Button type="submit">Logout</Button>
            </form>
          </div>
        </nav>
      </header>
      <section>{children}</section>
    </>
  );
};

export default DashboardLayout;
