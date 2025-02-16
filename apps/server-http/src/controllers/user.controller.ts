import { prisma } from "@repo/database/prisma";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { signUpUserSchema, loginUserSchema } from "@repo/schemas/schema";
import { JWT_SECRET } from "@repo/envs/config";
import asyncHandler from "../utils/asyncHandler";

// Sign up user controller
export const signUpUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const { email, name, password } = signUpUserSchema.parse(req.body);

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // If the user already exists, return an error
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // Send the response
    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Something went wrong. Please try again later",
    });
  }
});

// Login user controller
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const { email, password } = loginUserSchema.parse(req.body);

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // If the user does not exist, return an error
    if (!user) {
      return res.status(400).json({
        message: "User does not except. Try signing up.",
      });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If the password is invalid, return an error
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid password. Please try again",
      });
    }

    // Create a JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      JWT_SECRET!,
      {
        expiresIn: "24h",
      }
    );

    // Send the response
    res.status(200).json({
      token,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Something went wrong. Please try again later",
    });
  }
});
