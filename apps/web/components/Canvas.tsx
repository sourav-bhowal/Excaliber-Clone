"use client";
import { User } from "next-auth";
import { useSocket } from "../hooks/useSocket";
import { draw } from "../utils/draw";
import { useEffect, useRef } from "react";

// Canvas component props
interface CanvasProps {
  roomId: string;
  user: User;
}

// Canvas component
export default function Canvas({ roomId, user }: CanvasProps) {
  // Get the token from the user
  const token = user.token as string;

  // Ref to the canvas element
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Get the Web Socket connection
  const { socket, isLoading } = useSocket(token, roomId);

  // useEffect to draw on the canvas
  useEffect(() => {
    if (canvasRef.current && socket) {
      draw({
        canvas: canvasRef.current,
        roomId,
        socket,
        token,
      });
    }
  }, [canvasRef, roomId, socket, token]);

  // If loading, return loading message
  if (isLoading || !socket) return <div>Connecting to server...</div>;

  // Return the canvas element
  return (
    <div>
      <canvas ref={canvasRef} width={2000} height={1000}></canvas>
      <div className="absolute top-0 flex gap-2">
        <div className="bg-white p-2 rounded-md text-black">Rectangle</div>
        <div className="bg-white p-2 rounded-md text-black">Circle</div>
      </div>
    </div>
  );
}
