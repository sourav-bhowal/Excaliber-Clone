import NotFound from "../../../not-found";
import ChatRoom from "../../../../components/ChatRoom";
import { getRoomBySlug } from "../../../../utils/functions";
import { auth } from "../../../api/auth/[...nextauth]/auth";

// Interface: RoomPageProps
interface RoomPageProps {
  params: Promise<{ roomSlug: string }>;
}

// Room page component
export default async function RoomPage({ params }: RoomPageProps) {
  // Authenticate the user
  const session = await auth();
  const token = session?.user?.token;
  // Get the roomSlug from the params
  const { roomSlug } = await params;

  // Get the room details
  const room = await getRoomBySlug(roomSlug, token as string);

  // If the room is not found, return a 404 page
  if (!room) return NotFound();

  return <ChatRoom roomId={room.id} />;
}
