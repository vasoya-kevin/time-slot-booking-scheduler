"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React, { JSX, SVGProps, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { registerAction } from "@/app/actions/auth";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { confirmPassword, ...registerData } = data;
      const result = await registerAction(registerData);

      if (!result.success) {
        setError(result.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full font-sans">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <Card className="mt-4 sm:mx-auto sm:w-full sm:max-w-md bg-accent">
          <CardContent>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <h3 className="text-balance mt-2 text-center text-lg font-bold text-foreground dark:text-foreground">
                Create New Account For Workspace
              </h3>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-10">
              <div>
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground dark:text-foreground"
                >
                  Name
                </Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Name"
                  className="mt-2"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground dark:text-foreground"
                >
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="ephraim@blocks.so"
                  className="mt-2"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground dark:text-foreground"
                >
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Password"
                  className="mt-2"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-foreground dark:text-foreground"
                >
                  Confirm password
                </Label>
                <Input
                  type="password"
                  id="confirmPassword"
                  placeholder="Password"
                  className="mt-2"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="mt-4 w-full py-2 font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
            {error && (
              <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/10 dark:text-red-400 rounded-md">
                {error}
              </div>
            )}

            <div>
              <h2 className="text-center w-full mt-4">
                Already registered?{" "}
                <Link className="border-b border-black/50" href="/sign-in">
                  Sign in
                </Link>
              </h2>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
