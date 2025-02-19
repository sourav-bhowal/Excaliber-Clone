import ChatRoomClient from "./ChatRoomClient";
import { getChatsByRoomId } from "../utils/functions";
import { auth } from "../app/api/auth/[...nextauth]/auth";
import { User } from "next-auth";

// Code: Chat component
interface ChatProps {
  roomId: string;
}

// Chat component
export default async function ChatRoom({ roomId }: ChatProps) {
  const session = await auth();
  const user = session?.user;
  // get chats by room id
  const chats = await getChatsByRoomId(roomId);

  return <ChatRoomClient messages={chats} roomId={roomId} user={user as User} />;
}
