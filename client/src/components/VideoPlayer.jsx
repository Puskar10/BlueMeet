// components/VideoPlayer.js
import React from 'react';

const VideoPlayer = ({ participant, isLocal }) => {
  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
      {/* Video placeholder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl text-white">
            {participant.name?.charAt(0).toUpperCase()}
          </div>
          <p className="text-white text-sm">
            {participant.name} {isLocal && "(You)"}
          </p>
        </div>
      </div>

      {/* Participant name tag */}
      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
        {participant.name} {isLocal && "(You)"}
      </div>
    </div>
  );
};

export default VideoPlayer;