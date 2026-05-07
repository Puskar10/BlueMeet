import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { saveRoomSession } from "../utils/rejoin";

const JoinRoomModal = ({ isOpen, onClose, onJoin }) => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!roomId.trim() || !userName.trim()) return;

    try {
      setLoading(true);

      // Save in localStorage
      localStorage.setItem("roomId", roomId);
      localStorage.setItem("userName", userName);

      // Save in Firebase
      await saveRoomSession(roomId, userName);

      // Join room
      onJoin(roomId, userName);

      onClose();
    } catch (error) {
      console.error("Join error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-800 rounded-lg w-96"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <div className="p-6">
              <h2 className="text-xl text-white mb-4">
                Join Meeting Room
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Room ID"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={handleJoin}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Joining..." : "Join Room"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JoinRoomModal;