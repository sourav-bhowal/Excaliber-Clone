import axios from "axios";
import { config } from "@repo/envs/config";

// get roomBySlug function
export const getRoomBySlug = async (slug: string, token: string) => {
  // Make a GET request to the server to get the room
  const response = await axios.get(`${config.HTTP_BACKEND_URL}/room/${slug}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Get the room from the response
  const room = response.data.room;

  // Return the room
  return room;
};

// Get the existing shapes from the server for a given room
export const getExistingShapes = async (roomId: string, token: string) => {
  // Make a GET request to the server to get the shapes
  const response = await axios.get(
    `${config.HTTP_BACKEND_URL}/room/chats/${roomId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Get the shapes from the response
  const shapesFromServer = response.data.chats;

  // Map the shapes to the existing shapes format
  const existingShapes = shapesFromServer.map((shape: { message: string }) => {
    // Parse the shape message
    const shapeData = JSON.parse(shape.message);
    // Return the shape data
    return shapeData;
  });

  // Return the existing shapes
  return existingShapes;
};
