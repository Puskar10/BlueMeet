import { useState } from "react";
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
    toggleScreenShare,
    isScreenSharing,
  } = useWebRTC(roomId, joined);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <MinimalNavbar
        roomId={roomId}
        stream={stream}
        leaveMeeting={() => {
          leaveMeeting();
          setJoined(false);
          navigate("/");
        }}
        toggleScreenShare={toggleScreenShare}
        isScreenSharing={isScreenSharing}
        participants={2}
      />

      <div className="flex flex-1 items-center justify-center relative p-6">
        {/* Remote Video */}
        <div className="w-full max-w-6xl">
          <MainVideo remoteStream={remoteStream} />
        </div>

        {/* Self Video */}
        <SelfVideo videoRef={localVideoRef} stream={stream} />
      </div>
    </div>
  );
}

export default Meeting;
