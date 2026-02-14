import { Container } from "@/components/common";
import { Button } from "@/components/ui/button";
import React from "react";
import { logoutAction } from "../actions/auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <>
      <header className="font-sans h-16 border-b border-black/10 w-full shadow-lg">
        <nav className="max-w-7xl w-full mx-auto flex items-center justify-between h-full px-4">
          <h1 className="text-2xl font-bold">Scheduling Dashboard</h1>
          <div className="flex gap-4 items-center">
            <h2 className="text-sm">Welcome back!</h2>
            <form action={logoutAction}>
              <Button type="submit">Logout</Button>
            </form>
          </div>
        </nav>
      </header>
      <Container>
        <section>{children}</section>
      </Container>
    </>
  );
};

export default DashboardLayout;