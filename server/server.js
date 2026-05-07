const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
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
      "http://localhost:4173",
      "https://blue-meet-e7zz463l2-puskar10s-projects.vercel.app",
      "https://blue-meet-git-main-puskar10s-projects.vercel.app",
    ],
    credentials: true,
  },
  // Add connection state recovery
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true,
  }
});

// Store room information
const rooms = new Map(); // roomId -> Set of socketIds

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // Handle room joining
  socket.on("join-room", (roomId) => {
    console.log(`📡 Socket ${socket.id} trying to join room: ${roomId}`);
    
    // Get or create room set
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    
    const room = rooms.get(roomId);
    
    // Check if room is full (max 2 participants for 1-to-1)
    if (room.size >= 2) {
      console.log(`❌ Room ${roomId} is full`);
      socket.emit("room-full", { message: "Room is full (max 2 participants)" });
      return;
    }
    
    // Join the room
    room.add(socket.id);
    socket.join(roomId);
    console.log(`✅ Socket ${socket.id} joined room ${roomId}`);
    console.log(`📊 Room ${roomId} now has ${room.size} participants`);
    
    // Store roomId in socket for cleanup
    socket.data.roomId = roomId;
    
    // If this is the second user in the room, emit 'ready' to both users
    if (room.size === 2) {
      console.log(`🎯 Room ${roomId} has 2 users - emitting ready events`);
      
      // Get both participants
      const participants = Array.from(room);
      console.log(`Participants: ${participants.join(", ")}`);
      
      // Emit 'ready' to both users in the room
      io.to(roomId).emit("ready");
      
      // Also emit user-joined to the existing user
      participants.forEach(participantId => {
        if (participantId !== socket.id) {
          io.to(participantId).emit("user-joined", socket.id);
        }
      });
    } else {
      console.log(`⏳ Waiting for second user to join room ${roomId}`);
    }
  });

  // Handle WebRTC offer
  socket.on("offer", ({ offer, roomId }) => {
    console.log(`📤 Offer received from ${socket.id} in room ${roomId}`);
    // Broadcast to other participants in the room
    socket.to(roomId).emit("offer", offer);
  });

  // Handle WebRTC answer
  socket.on("answer", ({ answer, roomId }) => {
    console.log(`📥 Answer received from ${socket.id} in room ${roomId}`);
    // Broadcast to other participants in the room
    socket.to(roomId).emit("answer", answer);
  });

  // Handle ICE candidates
  socket.on("ice-candidate", ({ candidate, roomId }) => {
    console.log(`🧊 ICE candidate received from ${socket.id} in room ${roomId}`);
    // Broadcast to other participants in the room
    socket.to(roomId).emit("ice-candidate", candidate);
  });

  // Handle user leaving room
  socket.on("leave-room", (roomId) => {
    console.log(`🚪 Socket ${socket.id} leaving room ${roomId}`);
    
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room.delete(socket.id);
      
      // Notify other participants
      socket.to(roomId).emit("user-left", { userId: socket.id });
      
      // Clean up room if empty
      if (room.size === 0) {
        rooms.delete(roomId);
        console.log(`🗑️ Room ${roomId} deleted (empty)`);
      } else {
        console.log(`📊 Room ${roomId} now has ${room.size} participants`);
      }
    }
    
    socket.leave(roomId);
    delete socket.data.roomId;
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
    
    // Find and clean up rooms
    const roomId = socket.data.roomId;
    if (roomId && rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room.delete(socket.id);
      
      // Notify other participants
      socket.to(roomId).emit("user-left", { userId: socket.id });
      
      // Clean up empty rooms
      if (room.size === 0) {
        rooms.delete(roomId);
        console.log(`🗑️ Room ${roomId} deleted (empty after disconnect)`);
      } else {
        console.log(`📊 Room ${roomId} now has ${room.size} participants after disconnect`);
      }
    }
  });

  // Handle reconnection
  socket.on("reconnect-room", (roomId) => {
    console.log(`🔄 Socket ${socket.id} attempting to reconnect to room ${roomId}`);
    
    if (rooms.has(roomId)) {
      const room = rooms.get(roomId);
      
      // Check if user was previously in this room
      if (!room.has(socket.id)) {
        // Re-add user if there's space
        if (room.size < 2) {
          room.add(socket.id);
          socket.join(roomId);
          socket.data.roomId = roomId;
          console.log(`✅ Socket ${socket.id} reconnected to room ${roomId}`);
          
          // If room now has 2 users, emit ready
          if (room.size === 2) {
            console.log(`🎯 Room ${roomId} has 2 users after reconnect - emitting ready`);
            io.to(roomId).emit("ready");
          }
        } else {
          socket.emit("room-full", { message: "Room is full" });
        }
      }
    } else {
      // Create new room if it doesn't exist
      socket.emit("join-room", roomId);
    }
  });
});

// Error handling
io.engine.on("connection_error", (err) => {
  console.log("Connection error:", err);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 CORS enabled for development and production origins`);
});