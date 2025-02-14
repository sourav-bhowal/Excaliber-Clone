import { WebSocketServer } from "ws";

const webSocketServer = new WebSocketServer({ port: 8000 });

webSocketServer.on("connection", (socket) => {
  console.log("Client connected!!!");

  socket.on("message", (message) => {
    console.log(`Received message => ${message}`);
    socket.send(`PONG`);
  });

  socket.on("close", () => {
    console.log("Client disconnected!!!");
  });
});
