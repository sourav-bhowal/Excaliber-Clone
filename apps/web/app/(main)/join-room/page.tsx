"use client";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

// Form data interface
interface FormData {
  roomSlug: string;
}

// Home page component
export default function JoinRoomPage() {
  // Next.js router hook
  const router = useRouter();

  // Form component using react hook form
  const { register, handleSubmit, formState } = useForm<FormData>();

  // Form submit handler
  const onSubmit: SubmitHandler<FormData> = async ({ roomSlug }) => {
    // Send a GET request to the backend to get the room details
    router.push(`/room/${roomSlug}`);
  };

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="bg-gray-700 p-10 rounded-2xl text-center">
        <h1 className="text-white text-2xl font-bold mb-4">Join a Room</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center"
        >
          <input
            {...register("roomSlug")}
            placeholder="Enter the Room Slug"
            className="bg-gray-800 text-white p-2 rounded-lg w-ful mb-4 border-none"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg w-full font-semibold"
            disabled={formState.isSubmitting || !formState.isValid}
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
}
