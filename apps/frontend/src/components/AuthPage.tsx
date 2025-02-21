"use client";
import Link from "next/link";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Button } from "@repo/ui/button";

interface AuthPageProps {
  isSignIn: boolean;
}

export default function AuthPage({ isSignIn }: AuthPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {isSignIn ? "Welcome Back" : "Create Account"}
        </h1>
        <form className="space-y-6">
          {!isSignIn && (
            <div className="space-y-2">
              <Label>Name</Label>
              <Input type="text" placeholder="Enter your name" />
            </div>
          )}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="Enter your email" />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" placeholder="Enter your password" />
          </div>
          <Button>{isSignIn ? "Sign In" : "Create Account"}</Button>
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
