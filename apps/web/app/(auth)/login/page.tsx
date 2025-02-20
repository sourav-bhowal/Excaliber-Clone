"use client";
import { useForm } from "react-hook-form";
import { LoginUser } from "@repo/schemas/types";
import Link from "next/link";
import { signIn } from "next-auth/react";

// SignUpPage component
export default function SignIn() {
  // useForm hook
  const { register, handleSubmit } = useForm<LoginUser>();

  // onSubmit function
  async function onSubmit(data: LoginUser) {
    // Nextauth signin
    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirectTo: "/join-room"
    });
  }

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-700 p-10 rounded-2xl text-center flex flex-col lg:max-w-md w-full m-2"
      >
        <h1 className="text-white text-2xl font-bold mb-4">Log In</h1>
        <input
          {...register("email")}
          placeholder="Enter your email"
          className="bg-gray-800 text-white p-2 rounded-lg w-full mb-4 border-none"
        />
        <input
          {...register("password")}
          placeholder="Enter password"
          type="password"
          className="bg-gray-800 text-white p-2 rounded-lg w-full mb-4 border-none"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-lg w-full font-semibold"
        >
          Log in
        </button>
        <div
          className="
          text-white mt-4
          text-sm flex items-center justify-center
        "
        >
          Don&apos;t have an account?{" "}
          <Link href="/login">
            <p className="text-blue-500 ml-1">Sign up</p>
          </Link>
        </div>
      </form>
    </div>
  );
}
