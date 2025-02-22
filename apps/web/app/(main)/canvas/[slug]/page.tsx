import { User } from "next-auth";
import Canvas from "../../../../components/Canvas";
import { auth } from "../../../api/auth/[...nextauth]/auth";
import { getRoomBySlug } from "../../../../utils/functions";
import NotFound from "../../../not-found";

// Define the CanvasPageProps interface
interface CanvasPageProps {
  params: Promise<{ slug: string }>;
}

// Canvas page component
export default async function CanvasPage({ params }: CanvasPageProps) {
  // Get the roomId from the params
  const { slug } = await params;

  // `Session` object is available in the `auth` function
  const session = await auth();

  // Get the user from the session
  const user = session?.user;

  // Get room by slug
  const room = await getRoomBySlug(slug, user?.token as string);

  // If no room, return
  if (!room) return NotFound();

  // Return the canvas element
  return <Canvas roomId={room.id} user={user as User} />;
}
