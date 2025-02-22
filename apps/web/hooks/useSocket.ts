import { config } from "@repo/envs/config";
import { useEffect, useState } from "react";

// Custom hook to use a WebSocket connection
export function useSocket(token: string, roomId: string) {
  // State to store the WebSocket connection
  const [socket, setSocket] = useState<WebSocket | null>(null);
  // State to indicate if the connection
  const [isLoading, setIsLoading] = useState(true);
  // useEffect to create a new WebSocket connection
  useEffect(() => {
    // Create a new WebSocket connection
    const ws = new WebSocket(`${config.WS_BACKEND_URL}/?token=${token}`);
    // Set the WebSocket connection in the state if the connection is open
    ws.onopen = () => {
      setSocket(ws);
      // Send a message to join the room
      ws.send(
        JSON.stringify({
          type: "join-room",
          roomId,
        })
      );
    };
    // Set the loading state to false
    setIsLoading(false);
  }, [roomId, token]);
  // Return the WebSocket connection and loading state
  return { socket, isLoading };
}
