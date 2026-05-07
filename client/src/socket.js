import { io } from "socket.io-client";

const URL =
  import.meta.env.MODE === "production"
    ? "https://bluemeet.onrender.com"
    : "http://localhost:5000";

const socket = io(URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  withCredentials: true,
});

// Add connection logging for debugging
socket.on("connect", () => {
  console.log("✅ Socket connected successfully:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
  if (reason === "io server disconnect") {
    // Reconnect manually if server disconnected
    socket.connect();
  }
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

socket.on("reconnect", (attemptNumber) => {
  console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
});

socket.on("reconnect_attempt", (attemptNumber) => {
  console.log(`🔄 Socket reconnection attempt ${attemptNumber}`);
});

export default socket;