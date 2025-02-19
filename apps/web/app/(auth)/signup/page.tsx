"use client";
import { useForm } from "react-hook-form";
import { SignUpUser } from "@repo/schemas/types";
import axios from "axios";
import { config } from "@repo/envs/config";
import { useRouter } from "next/navigation";
import Link from "next/link";

// SignUpPage component
export default function SignUpPage() {
  // useForm hook
  const { register, handleSubmit } = useForm<SignUpUser>();

  const router = useRouter();

  // onSubmit function
  const onSubmit = async (data: SignUpUser) => {
    try {
      const response = await axios.post(
        `${config.HTTP_BACKEND_URL}/signup`,
        data
      );
      if (response.status === 201) {
        router.push("/login");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Please try again later");
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-700 p-10 rounded-2xl text-center flex flex-col lg:max-w-md w-full m-2"
      >
        <h1 className="text-white text-2xl font-bold mb-4">Sign Up</h1>
        <input
          {...register("name")}
          placeholder="Enter your name"
          className="bg-gray-800 text-white p-2 rounded-lg w-full mb-4 border-none"
        />
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
          Sign up
        </button>

        <div
          className="
          text-white mt-4
          text-sm flex items-center justify-center
        "
        >
          Already have an account?{" "}
          <Link href="/login">
            <p className="text-blue-500 ml-1">Login</p>
          </Link>
        </div>
      </form>
    </div>
  );
}
