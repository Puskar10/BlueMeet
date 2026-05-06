import { io } from "socket.io-client";

const URL =
  import.meta.env.MODE === "production"
    ? "https://bluemeet.onrender.com"
    : "http://localhost:5000";

const socket = io(URL, {
  autoConnect: true,
});

export default socket;