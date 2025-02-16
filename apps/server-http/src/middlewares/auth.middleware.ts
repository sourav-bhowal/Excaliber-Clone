import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler";
import { config } from "@repo/envs/config";

// Middleware to check if the user is authenticated
export const authMiddleware = asyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    // Get the token from the request headers
    const token = req.headers.authorization?.split(" ")[1] ?? "";

    // If the token is not present, return an error
    if (!token) {
      res.status(401).json({
        message: "Unauthorized. No token provided",
      });
    }

    // Verify the token
    try {
      // Verify the token
      const decodedToken = jwt.verify(token, config.JWT_SECRET!);

      // If no decoded token is found, return an error
      if (!decodedToken) {
        res.status(401).json({
          message: "Unauthorized. Invalid token",
        });
      }

      // Set the user in the request object
      req.user = decodedToken as CustomUser;

      // Call the next middleware
      next();
    } catch (error) {
      res.status(401).json({
        message: "Unauthorized. Invalid token",
      });
    }
  }
);
