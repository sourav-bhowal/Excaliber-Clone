import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { createRoomSchema } from "@repo/schemas/schema";
import { prisma } from "@repo/database/prisma";

// Create a room controller
export const createRoom = asyncHandler(async (req: Request, res: Response) => {
  // Validate the request body
  const { roomName } = createRoomSchema.parse(req.body);

  // Get the user ID from the request
  const userId = req.user?.id;

  // If the user ID is not present, return an error
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized. Please log in",
    });
  }

  // Check if the room already exists
  const existingRoom = await prisma.room.findUnique({
    where: {
      slug: roomName,
    },
  });

  // If the room already exists, return an error
  if (existingRoom) {
    return res.status(400).json({
      message: "Room already exists",
    });
  }

  // Create a new room
  const room = await prisma.room.create({
    data: {
      slug: roomName,
      adminId: userId,
    },
  });

  // Send the response
  res.status(201).json({
    message: "Room created successfully",
    data: room,
  });
});

// Get the chats of a room controller
export const getRoomChats = asyncHandler(
  async (req: Request, res: Response) => {
    // Get the room ID from the request
    const roomId = req.params.roomId;

    // If the room ID is not present, return an error
    if (!roomId) {
      return res.status(400).json({
        message: "Room ID is required",
      });
    }

    // Get the chats of the room
    const chats = await prisma.chat.findMany({
      where: {
        roomId,
      },
      include: {
        user: true,
      },
      orderBy: {
        id: "desc",
      },
      take: 50,
    });

    // Send the response
    res.status(200).json({
      data: chats,
      message: "Chats retrieved successfully",
    });
  }
);
