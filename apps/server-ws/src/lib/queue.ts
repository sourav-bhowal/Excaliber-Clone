import { RABBITMQ_URL } from "@repo/envs/config";
import amqp, { Connection, Channel, ConsumeMessage } from "amqplib";

// Define connection and channel variables as null
let connection: Connection | null = null;
let channel: Channel | null = null;

// Connect to RabbitMQ server and return connection and channel
const connectRabbitMQ = async () => {
  // If connection and channel are already present, return them
  if (connection && channel) {
    return { connection, channel };
  }

  // Try to connect to RabbitMQ server and create a channel
  try {
    // Connect to RabbitMQ server
    connection = await amqp.connect(RABBITMQ_URL);
    console.log("Connected to RabbitMQ!!");
    // Create a channel
    channel = await connection.createChannel();
    // Assert a queue named chatQueue with durable option as true
    await channel.assertQueue("chatQueue", { durable: true });
    // Return connection and channel
    return { connection, channel };
  } catch (error) {
    // If error occurs, log the error and throw it
    console.error("Failed to connect to RabbitMQ:", error);
    throw error;
  }
};

// Publish message to chatQueue with the message as JSON string
export const publishToQueue = async (message: object) => {
  try {
    // Connect to RabbitMQ server and get channel
    const { channel } = await connectRabbitMQ();
    // Publish message to chatQueue with message as JSON string
    channel.sendToQueue("chatQueue", Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
  } catch (error) {
    // If error occurs, log the error
    console.error("Failed to publish message to RabbitMQ:", error);
  }
};

// Consume messages from chatQueue and call callback function
export const consumeQueue = async (
  callback: (msg: ConsumeMessage | null) => void
) => {
  try {
    // Connect to RabbitMQ server and get channel
    const { channel } = await connectRabbitMQ();
    // Consume messages from chatQueue and call callback function
    channel.consume(
      "chatQueue",
      (msg) => {
        if (msg) {
          // Call the callback function with the message
          callback(msg);
          // Acknowledge the message so that it is removed from the queue
          channel.ack(msg);
        }
      },
      // Set noAck option as false to acknowledge the message manually
      { noAck: false }
    );
  } catch (error) {
    // If error occurs, log the error
    console.error("Failed to consume messages from RabbitMQ:", error);
  }
};
