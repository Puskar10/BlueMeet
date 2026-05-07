import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useWebRTC from "../hooks/useWebRTC";
import MinimalNavbar from "../components/Navbar";
import MainVideo from "../components/MainVideo";
import SelfVideo from "../components/SelfVideo";

function Meeting() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [joined, setJoined] = useState(true);

  const {
    stream,
    remoteStream,
    localVideoRef,
    leaveMeeting,
    rejoinMeeting,
    toggleScreenShare,
    isScreenSharing,
  } = useWebRTC(roomId, joined);

  // Handle leave meeting with localStorage cleanup
  const handleLeaveRoom = () => {
    // Clear stored session data from localStorage
    localStorage.removeItem("roomId");
    localStorage.removeItem("userName");
    
    // Leave the meeting
    leaveMeeting();
    setJoined(false);
    
    // Navigate back to home
    navigate("/");
  };

  // Handle rejoin meeting
  const handleRejoin = () => {
    rejoinMeeting();
  };

  // Optional: Check if user is trying to refresh/close the page
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Don't clear localStorage on refresh, only on explicit leave
      // This allows rejoin functionality to work after page refresh
      return;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <MinimalNavbar
        roomId={roomId}
        stream={stream}
        leaveMeeting={handleLeaveRoom}  // 👈 Use the enhanced leave function
        toggleScreenShare={toggleScreenShare}
        isScreenSharing={isScreenSharing}
        participants={2}
      />

      <div className="flex flex-1 items-center justify-center relative p-6">
        <div className="w-full max-w-6xl">
          <MainVideo remoteStream={remoteStream} onRejoin={handleRejoin} />
        </div>
        <SelfVideo videoRef={localVideoRef} stream={stream} />
      </div>
    </div>
  );
}

export default Meeting;