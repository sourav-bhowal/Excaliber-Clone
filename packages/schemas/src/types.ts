import { z } from "zod";
import { signUpUserSchema, loginUserSchema, createRoomSchema } from "./schema";

export type SignUpUser = z.infer<typeof signUpUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type CreateRoom = z.infer<typeof createRoomSchema>;
