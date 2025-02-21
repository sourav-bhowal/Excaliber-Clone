// Types of shapes to draw
type Shape =
  | {
      type: "rectangle";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "line";
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    };

// Function to draw shapes on the canvas
export function draw(canvas: HTMLCanvasElement) {
  // Get the 2d context
  const context = canvas?.getContext("2d");

  // Existing shapes to draw
  const existingShapes: Shape[] = [];

  // If no context, return
  if (!context) return;

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

    // Add the rectangle to the existing shapes
    existingShapes.push({
      type: "rectangle",
      x: startX,
      y: startY,
      width,
      height,
    });
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
      context.strokeStyle = "red";
      context.strokeRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      context.beginPath();
      context.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
      context.stroke();
    } else if (shape.type === "line") {
      context.beginPath();
      context.moveTo(shape.x1, shape.y1);
      context.lineTo(shape.x2, shape.y2);
      context.stroke();
    }
  });
}
