const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { Socket } = require("dgram");

const app = express();
app.use(cors({
   origin: [
    "http://localhost:5173",
    "https://blue-meet-e7zz463l2-puskar10s-projects.vercel.app",
    "https://blue-meet-git-main-puskar10s-projects.vercel.app"
  ],
  credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://blue-meet-e7zz463l2-puskar10s-projects.vercel.app",
      "https://blue-meet-git-main-puskar10s-projects.vercel.app",
    ],
    credentials: true,
  },
});
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    const roomSize = room ? room.size : 0;
    if (room && room.size >= 2) {
      console.log("Room is full:", roomId);
      socket.emit("room-full");
      return;
    }
    socket.join(roomId);
    console.log(socket.id, "joined", roomId);
    const updateRoom = io.sockets.adapter.rooms.get(roomId);
    console.log("Room members:", updateRoom);

    if (updateRoom.size === 2) {
      console.log("2 users in room → emitting ready");
      socket.to(roomId).emit("ready");
    }

    console.log("ROOM MEMBERS:", io.sockets.adapter.rooms.get(roomId));

    socket.to(roomId).emit("user-joined", socket.id);
  });

  socket.on("offer", ({ offer, roomId }) => {
    console.log("Offer received from:", socket.id);
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", ({ answer, roomId }) => {
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice-candidate", ({ candidate, roomId }) => {
    socket.to(roomId).emit("ice-candidate", candidate);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
