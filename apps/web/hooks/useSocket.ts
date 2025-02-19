import { config } from "@repo/envs/config";
import { useEffect, useRef, useState } from "react";

// This hook is used to create a WebSocket connection to the backend server
export function useSocket(token: string) {
  // Create a reference to the WebSocket object
  const socket = useRef<WebSocket | null>(null);
  // Create a state variable to keep track of the loading state
  const [loading, setLoading] = useState(true);

  // Create the WebSocket connection when the component mounts
  useEffect(() => {
    // Create a new WebSocket connection
    socket.current = new WebSocket(`${config.WS_BACKEND_URL}?token=${token}`);
    // Set the loading state to false when the connection is open
    socket.current.onopen = () => setLoading(false);
  }, []);

  // Return the WebSocket object and the loading state
  return { socket: socket.current, loading };
}
