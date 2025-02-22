"use client";
import Link from "next/link";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Button } from "@repo/ui/button";
import { signIn } from "next-auth/react";
import { LoginUser, SignUpUser } from "@repo/schemas/types";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { config } from "@repo/envs/config";
import { useRouter } from "next/navigation";

// AuthPage component
interface AuthPageProps {
  isSignIn: boolean;
}

// AuthPage component
export default function AuthPage({ isSignIn }: AuthPageProps) {
  // useForm hook
  const { register, handleSubmit, formState } = useForm<
    LoginUser | SignUpUser
  >();

  // useRouter hook
  const router = useRouter();

  // onSubmit function
  const onSubmit: SubmitHandler<LoginUser | SignUpUser> = async (data) => {
    if (isSignIn) {
      try {
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirectTo: "/room/join-room",
        });
      } catch (error) {
        console.log(error);
        alert("Invalid email or password");
      }
    } else {
      try {
        const response = await axios.post(
          `${config.HTTP_BACKEND_URL}/signup`,
          data
        );
        if (response.status === 201) {
          router.push("/signin");
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.log(error);
        alert("Something went wrong. Please try again later");
      }
    }
  };

  // AuthPage component
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {isSignIn ? "Welcome Back" : "Create Account"}
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {!isSignIn && (
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                type="text"
                placeholder="Enter your name"
                {...register("name")}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
            />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
            />
          </div>
          <Button disabled={formState.isSubmitting}>
            {isSignIn ? "Sign In" : "Create Account"}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          {isSignIn ? (
            <p>
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign Up
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign In
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
