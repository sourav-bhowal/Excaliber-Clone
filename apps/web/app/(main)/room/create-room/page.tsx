"use client";
import { CreateRoom } from "@repo/schemas/types";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

// Home page component
export default function CreateRoomPage() {
  // Next.js router hook
  const router = useRouter();

  // Form component using react hook form
  const { register, handleSubmit, formState } = useForm<CreateRoom>();

  // Form submit handler
  const onSubmit: SubmitHandler<CreateRoom> = async (data) => {
    const response = await axios.post("/api/room", data);

    if (response.status === 201) {
      router.push(`/canvas/${response.data.room.slug}`);
    } else {
      alert("Error creating room");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Create Room
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("slug")} placeholder="Enter the Room Slug" />
          <Button
            type="submit"
            disabled={formState.isSubmitting || !formState.isValid}
          >
            {formState.isSubmitting ? "Creating..." : "Create Room"}
          </Button>
        </form>
      </div>
    </div>
  );
}
