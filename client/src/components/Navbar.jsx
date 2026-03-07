import React, { useState } from "react";
import {
  VideoCameraIcon,
  MicrophoneIcon,
  PhoneIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ComputerDesktopIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const MinimalNavbar = ({ roomId, stream, leaveMeeting, participants, isScreenSharing, toggleScreenShare }) => {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const toggleMic = () => {
    if (!stream) return;

    stream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setMicOn(!micOn);
  };

  const toggleCam = () => {
    if (!stream) return;

    stream.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setCamOn(!camOn);
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <VideoCameraIcon className="h-6 w-6 text-blue-400" />
          <span className="font-semibold text-lg">Meet</span>
        </div>

        {/* Meeting ID */}
        <div className="hidden md:block">
          <span className="text-sm text-gray-400">
            Meeting ID:
            <span className="text-white font-mono ml-2">{roomId}</span>
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4 relative">
          {/* Mic */}
          <button
            onClick={toggleMic}
            className={`p-2 rounded-full transition 
              ${micOn ? "hover:bg-gray-800" : "bg-red-600"}`}
          >
            <MicrophoneIcon className="h-5 w-5" />
          </button>

          {/* Camera */}
          <button
            onClick={toggleCam}
            className={`p-2 rounded-full transition 
              ${camOn ? "hover:bg-gray-800" : "bg-red-600"}`}
          >
            <VideoCameraIcon className="h-5 w-5" />
          </button>

          {/* Participants */}
          <div className="relative">
            <button className="p-2 hover:bg-gray-800 rounded-full transition">
              <UserGroupIcon className="h-5 w-5" />
            </button>

            <span className="absolute -top-1 -right-1 bg-blue-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {participants}
            </span>
          </div>

          {/* Chat */}
          <button className="p-2 hover:bg-gray-800 rounded-full transition">
            <ChatBubbleLeftRightIcon className="h-5 w-5" />
          </button>

          {/* Leave */}
          <button
            onClick={leaveMeeting}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-sm font-medium transition"
          >
            Leave
          </button>

          {/* Settings */}
          <button className="p-2 hover:bg-gray-800 rounded-full transition">
            <Cog6ToothIcon className="h-5 w-5" />
          </button>

          <button
            onClick={toggleScreenShare}
            className={`p-2 rounded-full transition 
              ${isScreenSharing ? "bg-green-600" : "hover:bg-gray-800"}`}
            title={isScreenSharing ? "Stop sharing" : "Share screen"}
          >
            <ComputerDesktopIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default MinimalNavbar;
