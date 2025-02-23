"use client";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { draw } from "../utils/draw";
import { User } from "next-auth";

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

  const [shapeToDraw, setShapeToDraw] = useState<string | null>("rectangle");

  // useEffect to draw on the canvas
  useEffect(() => {
    let cleanup: () => void;

    if (canvasRef.current && socket) {
      cleanup = draw({
        canvas: canvasRef.current,
        roomId,
        socket,
        token,
        shapeToDraw,
      });
    }

    return () => {
      if (cleanup) cleanup();
    };
  }, [canvasRef, roomId, shapeToDraw, socket, token]);

  // If loading, return loading message
  if (isLoading || !socket) return <div>Connecting to server...</div>;

  // Return the canvas element and shape selection buttons
  return (
    <div className="relative">
      <div className="flex gap-3 mb-4 z-10 p-2 rounded-lg absolute top-0 right-0 bg-white bg-opacity-50">
        {["rectangle", "circle", "line"].map((shape) => (
          <button
            key={shape}
            onClick={() => setShapeToDraw(shape)}
            className={`px-4 py-2 rounded-lg ${shapeToDraw === shape ? "bg-blue-500 text-white" : "bg-white text-black"}`}
          >
            {shape}
          </button>
        ))}
      </div>
      <canvas ref={canvasRef} width={1650} height={700} />
    </div>
  );
}
