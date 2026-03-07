// components/FloatingSelfView.js
import React from 'react';
import { motion } from 'framer-motion';

const FloatingSelfView = ({ stream }) => (
  <motion.div
    className="fixed bottom-24 right-6 w-40 h-24 rounded-xl overflow-hidden shadow-xl border-2 border-white"
    drag
    dragConstraints={{
      top: 0,
      left: 0,
      right: window.innerWidth - 160,
      bottom: window.innerHeight - 120,
    }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <div className="bg-gray-400 w-full h-full flex items-center justify-center">
      <span className="text-white text-sm">You</span>
    </div>
  </motion.div>
);

export default FloatingSelfView;
