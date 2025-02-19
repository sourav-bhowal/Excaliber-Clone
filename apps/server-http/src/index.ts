import express, { Application } from "express";
import cors from "cors";
import { signUpUser, loginUser } from "./controllers/user.controller";
import { authMiddleware } from "./middlewares/auth.middleware";
import {
  createRoom,
  getRoomBySlug,
  getRoomChats,
} from "./controllers/room.controller";
import { config } from "@repo/envs/config";

// Create an express app
const app: Application = express();

// Use of express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

// Routes
app.post("/api/signup", signUpUser);
app.post("/api/login", loginUser);
app.post("/api/room/create", authMiddleware, createRoom);
app.get("/api/room/chats/:roomId", authMiddleware, getRoomChats);
app.get("/api/room/:slug", authMiddleware, getRoomBySlug);

// Start the server
app.listen(config.HTTP_PORT, () => {
  console.log("HTTP Server is running on port " + config.HTTP_PORT);
});
