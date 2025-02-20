import { config } from "@repo/envs/config";
import axios from "axios";

// Get the room details from the backend
export const getRoomBySlug = async (roomSlug: string, token: string) => {
  const response = await axios.get(
    `${config.HTTP_BACKEND_URL}/room/${roomSlug}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.room;
};

// Get chats by room id
export const getChatsByRoomId = async (roomId: string, token: string) => {
  const res = await axios.get(
    `${config.HTTP_BACKEND_URL}/room/chats/${roomId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.chats;
};
