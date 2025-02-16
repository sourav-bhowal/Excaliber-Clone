import { config as conf } from "dotenv";

// Load the environment variables from the .env file
conf({
  path: "../../.env",
});

// Define the configuration object
const _config = {
  JWT_SECRET: process.env.JWT_SECRET,
  RABBITMQ_URL: process.env.RABBITMQ_URL,
};

// Freeze the configuration object to prevent modification
export const config = Object.freeze(_config);
