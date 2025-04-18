const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`📥 ${socket.id} joined room ${room}`);
  });

  socket.on("send-message", ({ room, message }) => {
    io.to(room).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

server.listen(4000, () => {
  console.log("🚀 Chat server running on http://localhost:4000");
});
