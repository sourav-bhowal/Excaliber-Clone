import express, { Application } from "express";
import { signUpUser, loginUser } from "./controllers/user.controller";
import cors from "cors";
import { authMiddleware } from "./middlewares/auth.middleware";

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
app.post("/api/room", authMiddleware);

// Start the server
app.listen(5000, () => {
  console.log("HTTP Server is running on port 5000");
});
