"use client";
import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { User } from "next-auth";

// Define the props for the ChatRoom component
interface ChatRoomProps {
  roomId: string;
  messages: { message: string }[];
  user: User;
}

// Create the ChatRoom component
export default function ChatRoomClient({ roomId, messages, user }: ChatRoomProps) {;
  const { socket, loading } = useSocket(user.token as string);

  // Use the useState hook to manage the chats state
  const [chats, setChats] = useState(messages);

  // State to manage the current message
  const [currentMessage, setCurrentMessage] = useState("");

  // Use the useEffect hook to listen for messages from the WebSocket connection
  useEffect(() => {
    if (socket && !loading) {
      // Send a message to the server to join the room
      socket.send(JSON.stringify({ type: "join-room", roomId }));
      // Listen for messages from the server
      socket.onmessage = (event) => {
        // Parse the message data
        const parsedData = JSON.parse(event.data);
        // Check the message type
        if (parsedData.type === "chat") {
          // Update the chats state with the new messages
          setChats((oldChats) => [
            ...oldChats,
            { message: parsedData.message },
          ]);
        }
      };
    }
  }, [socket, loading, roomId]);

  // Submit a new message to the server
  function submitMessage() {
    if (socket) {
      // Send the message to the server
      socket.send(
        JSON.stringify({
          type: "chat",
          roomId,
          message: currentMessage,
        })
      );
      // Clear the current message
      setCurrentMessage("");
    }
  }

  if (loading || socket?.CONNECTING) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Chat Room</h1>
      <div>
        {chats.map((chat, index) => (
          <div key={index}>{chat.message}</div>
        ))}
      </div>
      <input
        type="text"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />
      <button
        onClick={submitMessage}
        disabled={!socket || loading || currentMessage === ""}
      >
        Send Message
      </button>
    </div>
  );
}
