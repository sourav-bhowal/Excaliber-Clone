import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/envs/config";

// Create a WebSocket server on port 8000
const webSocketServer = new WebSocketServer({ port: 8000 });

// Listen for connection events
webSocketServer.on("connection", (socket, request) => {
  console.log("WS Server --- Client connected!!!");

  // Get the URL of the request
  const url = request.url;

  // If the URL is not present, return
  if (!url) {
    return;
  }

  // Get the query parameters from the URL using URLSearchParams
  const queryParams = new URLSearchParams(url.split("?")[1]);

  // Get the token from the query parameters
  const token = queryParams.get("token") || "";

  // Verify the token using the JWT_SECRET
  const decodedToken = jwt.verify(token, JWT_SECRET!) as JwtPayload;

  // If the token is not valid, close the connection
  if (!decodedToken || !decodedToken.id) {
    socket.close();
    return;
  }

  // Listen for message events from the client
  socket.on("message", (message) => {
    socket.send(`PONG`);
  });

  // Listen for close events
  socket.on("close", () => {
    console.log("Client disconnected!!!");
  });
});
