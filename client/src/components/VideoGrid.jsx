// components/VideoGrid.js
import React from 'react';
import VideoPlayer from './VideoPlayer';

const VideoGrid = ({ participants, localStream }) => {
  // Show all participants including local
  const allParticipants = participants;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-full">
      {allParticipants.map(participant => (
        <VideoPlayer 
          key={participant.id} 
          participant={participant}
          isLocal={participant.isLocal}
        />
      ))}
    </div>
  );
};

export default VideoGrid;