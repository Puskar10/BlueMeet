// components/VideoPlayer.js
import React, { useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';

const VideoPlayer = ({ participant, isLocal, stream, isAudioEnabled = true, isVideoEnabled = true }) => {
  const videoRef = useRef(null);
  
  // Attach stream to video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      
      // Play video
      videoRef.current.play().catch(err => {
        console.error("Video playback error:", err);
      });
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [stream]);
  
  // Check if stream has video tracks
  const hasVideo = stream && stream.getVideoTracks().length > 0 && isVideoEnabled;
  const hasAudio = stream && stream.getAudioTracks().length > 0 && isAudioEnabled;
  
  return (
    <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video shadow-xl group">
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal} // Mute local audio to prevent echo
        className={`w-full h-full object-cover transition-all duration-300 ${
          !hasVideo ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      {/* Video Placeholder (shown when no video stream) */}
      {!hasVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl text-white shadow-lg">
              {participant.name?.charAt(0).toUpperCase()}
            </div>
            <p className="text-white font-medium">
              {participant.name} {isLocal && "(You)"}
            </p>
            {!hasVideo && (
              <p className="text-gray-400 text-xs mt-1">Video off</p>
            )}
          </div>
        </div>
      )}
      
      {/* Video Status Badges */}
      <div className="absolute top-2 right-2 flex gap-2">
        {/* Video Status */}
        {!hasVideo && (
          <div className="bg-red-500/80 backdrop-blur-sm rounded-lg px-2 py-1">
            <VideoOff className="w-3 h-3 text-white" />
          </div>
        )}
        
        {/* Audio Status */}
        {!hasAudio ? (
          <div className="bg-red-500/80 backdrop-blur-sm rounded-lg px-2 py-1">
            <MicOff className="w-3 h-3 text-white" />
          </div>
        ) : (
          <div className="bg-green-500/80 backdrop-blur-sm rounded-lg px-2 py-1">
            <Mic className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      
      {/* Participant Name Tag */}
      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          hasAudio ? 'bg-green-500 animate-pulse' : 'bg-red-500'
        }`}></div>
        <span className="font-medium">
          {participant.name} {isLocal && "(You)"}
        </span>
      </div>
      
      {/* Speaking Indicator (optional - shows when user is speaking) */}
      {participant.isSpeaking && (
        <div className="absolute inset-0 border-4 border-green-500 rounded-xl animate-pulse pointer-events-none"></div>
      )}
      
      {/* Connection Quality Indicator */}
      {participant.quality && (
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-xs">
          <span className={
            participant.quality === 'good' ? 'text-green-400' :
            participant.quality === 'fair' ? 'text-yellow-400' :
            'text-red-400'
          }>
            {participant.quality === 'good' ? '📶 Good' :
             participant.quality === 'fair' ? '📶 Fair' :
             '📶 Poor'}
          </span>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;