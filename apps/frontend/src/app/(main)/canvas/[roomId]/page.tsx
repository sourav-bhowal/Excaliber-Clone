"use client";
import { draw } from "@/lib/draw";
import { Button } from "@repo/ui/button";
import { useEffect, useRef } from "react";

export default function Canvaspage() {
  // Ref to the canvas element
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // useEffect to draw a red rectangle on the canvas
  useEffect(() => {
    if (canvasRef.current) {
      draw(canvasRef.current);
    }
  }, [canvasRef]);

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
