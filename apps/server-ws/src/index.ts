import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "@repo/envs/config";
import { prisma } from "@repo/database/prisma";
import { publishToQueue, consumeQueue } from "./lib/queue";

// Create a WebSocket server on port 8000
const webSocketServer = new WebSocketServer({ port: Number(config.WS_PORT) });

// Interface of User object
interface User {
  id: string;
  rooms: string[];
}

// Map of User objects with WebSocket as key and User as value
const users = new Map<WebSocket, User>();

// Check user is authenticated or not using JWT token
function isAuthenticated(token: string): string | null {
  try {
    const decodedToken = jwt.verify(token, config.JWT_SECRET!) as JwtPayload;
    return decodedToken.id;
  } catch (error) {
    return null;
  }
}

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

  // Check if the user is authenticated or not
  const userId = isAuthenticated(token);

  // If the user is not authenticated, return
  if (!userId) {
    console.log("WS Server --- User is not authenticated.");
    socket.send(
      JSON.stringify({
        type: "Error",
        message: "User is not authenticated.",
      })
    );
    socket.close();
    console.log("WS Server --- Client disconnected!!!");
    return;
  }

  // Add the user to the users map with the WebSocket as key
  users.set(socket, {
    id: userId,
    rooms: [],
  });

  // Listen for "message" events from the client
  socket.on("message", async (data) => {
    try {
      // Parse the data to a JSON object
      const parsedData = JSON.parse(data.toString());

      // Get the type of the message
      const type = parsedData.type;

      // If the type is join-room
      if (type === "join-room") {
        // Get the room id from the parsed data
        const roomId = parsedData.roomId;

        // Get the user from the users map
        const user = users.get(socket);

        // If the user is not present, return
        if (!user) {
          return;
        }

        // Add the room id to the user's rooms array
        user.rooms.push(roomId);

        // Update the user in the users map
        users.set(socket, user);

        // Subscribe the user to the room
        socket.send(
          JSON.stringify({
            type: "join-room",
            roomId,
          })
        );
      }

      // If the type is leave-room
      if (type === "leave-room") {
        // Get the room id from the parsed data
        const roomId = parsedData.roomId;

        // Get the user from the users map
        const user = users.get(socket);

        // If the user is not present, return
        if (!user) {
          return;
        }

        // Remove the room id from the user's rooms array
        user.rooms = user.rooms.filter((room) => room !== roomId);

        // Update the user in the users map
        users.set(socket, user);

        // Unsubscribe the user from the room
        socket.send(
          JSON.stringify({
            type: "leave-room",
            roomId,
          })
        );
      }

      // If the type is chat message and the room id is present
      if (type === "chat" && parsedData.roomId) {
        // Get the room id and message from the parsed data
        const { roomId, message } = parsedData;

        // Get the user from the users map
        const user = users.get(socket);

        // If the user is not present, return
        if (!user) {
          return;
        }

        // Get the user's id
        const userId = user.id;

        // Get the user's name from the database
        const userFromDb = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });

        // If the user is not present in the database, return
        if (!userFromDb) {
          return;
        }

        // Get the user's name
        const userName = userFromDb.name;

        // Publish the message to the queue
        publishToQueue({
          roomId,
          userId,
          userName,
          message,
        });
      }
    } catch (error) {
      console.log(error);
      // If there is an error, send an error message
      socket.send(
        JSON.stringify({
          type: "Error",
          message: "Failed Internal Server Error.",
        })
      );
    }
  });
});

// Consume the message from the queue and send it to the users
consumeQueue(async (msg) => {
  // If the message is present
  if (msg) {
    // Parse the message data to a JSON object
    const messageData = JSON.parse(msg.content.toString());
    // Get the room id, user id, user name, and message from the message data
    const { roomId, userId, userName, message } = messageData;
    // Send the message to the users in the room
    users.forEach((user, ws) => {
      if (user.rooms.includes(roomId)) {
        ws.send(
          JSON.stringify({
            type: "chat",
            roomId,
            userId,
            userName,
            message,
          })
        );
      }
    });

    // Save the message to the database
    await prisma.chat.create({
      data: {
        roomId,
        userId,
        message,
      },
    });
  }
});
