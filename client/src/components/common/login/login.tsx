"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginAction(data);

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
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-1 flex-col justify-center lg:px-6 font-sans">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm border py-20 px-10 rounded-sm bg-accent">
          <h3 className="text-balance text-center text-lg font-semibold text-foreground dark:text-foreground">
            Welcome Back
          </h3>
          <p className="text-pretty text-center text-sm text-muted-foreground dark:text-muted-foreground">
            Enter your credentials to access your account.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
                placeholder="**************"
                className="mt-2"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="mt-4 w-full py-2 font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          {error && (
            <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/10 dark:text-red-400 rounded-md">
              {error}
            </div>
          )}
          <div className="text-pretty mt-6 text-sm text-muted-foreground dark:text-muted-foreground flex flex-col items-center">
            <h2>Haven't registered yet?</h2>
            <Link href="/sign-up" className="font-semibold hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
