import { Shape } from "../types/shapes";
import { getExistingShapes } from "./functions";

// Draw props
interface DrawProps {
  canvas: HTMLCanvasElement;
  roomId: string;
  socket: WebSocket;
  token: string;
}

// Function to draw shapes on the canvas
export async function draw({ canvas, roomId, socket, token }: DrawProps) {
  // Get the 2d context
  const context = canvas?.getContext("2d");

  // Get the existing shapes from the server for the given room
  const existingShapes: Shape[] = await getExistingShapes(roomId, token);

  // If no context, return
  if (!context) return;

  // Socket message event
  socket.onmessage = (event) => {
    const parsedData = JSON.parse(event.data); // Parse the data to a JSON object
    const type = parsedData.type; // Get the type of the message
    if (type === "chat") {
      // If the type is chat
      const parsedShape = JSON.parse(parsedData.message); // Parse the shape message
      existingShapes.push(parsedShape); // Add the shape to the existing shapes
      clearCanvasAndRedraw(existingShapes, context); // Clear the canvas and redraw all the existing shapes
    }
  };

  // Clear the canvas and redraw all the existing shapes
  clearCanvasAndRedraw(existingShapes, context);

  // DRAW LOGIC HERE
  let startDrawing = false; // Flag to indicate if the user is drawing
  let startX = 0; // Start position of the rectangle to draw
  let startY = 0; // Start position of the rectangle to draw

  // Mouse down event
  canvas.addEventListener("mousedown", (event) => {
    // Set the startDrawing flag to true
    startDrawing = true;
    // Set the start position of the rectangle to draw
    startX = event.clientX;
    startY = event.clientY;
  });

  // Mouse up event
  canvas.addEventListener("mouseup", (event) => {
    // Set the startDrawing flag to false
    startDrawing = false;

    // Get the width and height of the rectangle to draw based on the mouse position by subtracting the start position from the current position
    const width = event.clientX - startX;
    const height = event.clientY - startY;

    // Create a new rectangle object
    const NewShape: Shape = {
      type: "rectangle",
      x: startX,
      y: startY,
      width,
      height,
    };

    // Add the rectangle to the existing shapes
    existingShapes.push(NewShape);

    // Send the rectangle to the WS server
    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify(NewShape), // Send the rectangle as a string
        roomId,
      })
    );
  });

  // Mouse move event
  canvas.addEventListener("mousemove", (event) => {
    if (startDrawing) {
      // Get the width and height of the rectangle to draw based on the mouse position by subtracting the start position from the current position
      const width = event.clientX - startX;
      const height = event.clientY - startY;
      // Clear the canvas and redraw all the existing shapes
      clearCanvasAndRedraw(existingShapes, context);
      // strokeStyle is the color of the rectangle
      context.strokeStyle = "red";
      // Draw the rectangle
      context.strokeRect(startX, startY, width, height);
    }
  });
}

// Clear the canvas and redraw all the existing shapes
function clearCanvasAndRedraw(
  existingShapes: Shape[],
  context: CanvasRenderingContext2D
) {
  // Clear the canvas
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  // Redraw all the existing shapes
  existingShapes.forEach((shape) => {
    if (shape.type === "rectangle") {
      context.strokeStyle = "red"; // strokeStyle is the color of the rectangle
      context.strokeRect(shape.x, shape.y, shape.width, shape.height); // Draw the rectangle on the canvas
    } else if (shape.type === "circle") {
      context.beginPath(); // Begin a new path
      context.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI); // Draw a circle
      context.stroke(); // Stroke the circle
    } else if (shape.type === "line") {
      context.beginPath(); // Begin a new path
      context.moveTo(shape.x1, shape.y1); // Move the starting point of the line
      context.lineTo(shape.x2, shape.y2); // Draw a line to the end point
      context.stroke(); // Stroke the line
    }
  });
}
