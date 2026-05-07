import { useEffect, useRef, useState } from "react";
import { VideoOff, RefreshCw, WifiOff, Users } from "lucide-react";

function MainVideo({ remoteStream, onRejoin }) {
  const remoteVideoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [participantLeft, setParticipantLeft] = useState(false);
  const [hasStream, setHasStream] = useState(false);
  const [streamTracks, setStreamTracks] = useState(0);

  // Debug: Log remoteStream changes
  useEffect(() => {
    console.log("📹 MainVideo - remoteStream changed:", remoteStream);
    if (remoteStream) {
      const tracks = remoteStream.getTracks();
      console.log("📹 Remote stream tracks:", tracks.length);
      console.log("Track details:", tracks.map(t => ({ kind: t.kind, enabled: t.enabled, readyState: t.readyState })));
      setStreamTracks(tracks.length);
      setHasStream(tracks.length > 0);
      setParticipantLeft(false);
    } else {
      console.log("📹 No remote stream available");
      setHasStream(false);
      setStreamTracks(0);
    }
  }, [remoteStream]);

  // Attach stream to video element with proper error handling
  useEffect(() => {
    const video = remoteVideoRef.current;
    if (!video) {
      console.log("🎥 Video element not ready");
      return;
    }

    if (!remoteStream || remoteStream.getTracks().length === 0) {
      console.log("🎥 No valid remote stream, clearing video");
      video.srcObject = null;
      setParticipantLeft(true);
      setIsLoading(false);
      return;
    }

    console.log("🎥 Attaching remote stream to video element");
    console.log("Stream tracks:", remoteStream.getTracks().map(t => t.kind));
    
    // Clear previous stream
    video.srcObject = null;
    
    // Set the new stream
    video.srcObject = remoteStream;
    setIsLoading(true);
    setParticipantLeft(false);

    const playVideo = async () => {
      try {
        console.log("🎬 Attempting to play video...");
        await video.play();
        console.log("✅ Video playing successfully");
        setIsLoading(false);
      } catch (err) {
        console.error("❌ Playback failed:", err);
        setIsLoading(false);
        
        // Check if it's an autoplay policy issue
        if (err.name === "NotAllowedError") {
          console.log("Autoplay blocked, user interaction needed");
          // Show a button to manually start
          setParticipantLeft(true);
        }
      }
    };

    // Wait a bit for the stream to stabilize
    const timeoutId = setTimeout(() => {
      playVideo();
    }, 100);

    // Handle video events
    const handleCanPlay = () => {
      console.log("🎬 Video can play event");
      setIsLoading(false);
    };
    
    const handlePlaying = () => {
      console.log("🎬 Video is playing");
      setIsLoading(false);
    };
    
    const handleError = (e) => {
      console.error("🎬 Video error:", e);
      setIsLoading(false);
    };
    
    const handleLoadedMetadata = () => {
      console.log("🎬 Video metadata loaded");
      console.log("Video dimensions:", video.videoWidth, "x", video.videoHeight);
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("error", handleError);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    
    return () => {
      clearTimeout(timeoutId);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("error", handleError);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      if (video.srcObject === remoteStream) {
        video.srcObject = null;
      }
    };
  }, [remoteStream]);

  // Force re-attach when video element is ready but stream exists
  useEffect(() => {
    const video = remoteVideoRef.current;
    if (video && remoteStream && remoteStream.getTracks().length > 0 && !video.srcObject) {
      console.log("🔄 Video element ready but no stream attached, reattaching...");
      video.srcObject = remoteStream;
      video.play().catch(e => console.error("Retry play failed:", e));
    }
  }, [remoteStream, remoteVideoRef.current]);

  // Debug: Check if video element has srcObject
  useEffect(() => {
    const video = remoteVideoRef.current;
    if (video) {
      console.log("🎥 Video srcObject:", video.srcObject ? "Yes" : "No");
      if (video.srcObject) {
        console.log("Video stream tracks:", video.srcObject.getTracks().length);
      }
    }
  });

  const hasValidStream = remoteStream && remoteStream.getTracks().length > 0;

  // Waiting screen
  if (!hasValidStream && !participantLeft) {
    return (
      <div className="relative w-full md:w-3/4 lg:w-2/3 aspect-video mx-auto my-1 p-2">
        <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-950 to-purple-950 flex flex-col items-center justify-center text-white text-center p-8">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-blue-600/20 rounded-full flex items-center justify-center animate-pulse">
              <Users className="w-12 h-12 text-blue-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-ping"></div>
          </div>
          
          <h3 className="text-xl font-semibold mb-2">Waiting for participant to join</h3>
          <p className="text-blue-300 text-sm mb-4">
            Share the room ID to invite others
          </p>
          
          <div className="flex gap-2 text-xs text-blue-400">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span>Ready to connect</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Participant left screen
  if (participantLeft || (!hasValidStream && streamTracks === 0)) {
    return (
      <div className="relative w-full md:w-3/4 lg:w-2/3 aspect-video mx-auto my-1 p-2">
        <div className="w-full h-full rounded-lg bg-gradient-to-br from-gray-900 to-gray-950 flex flex-col items-center justify-center text-white text-center p-8 border border-red-500/20">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
            <WifiOff className="w-10 h-10 text-red-400" />
          </div>
          
          <h3 className="text-xl font-semibold mb-2">Participant Disconnected</h3>
          <p className="text-gray-400 text-sm mb-6">
            The other participant has left or is reconnecting.
          </p>
          
          {onRejoin && (
            <button
              onClick={async () => {
                console.log("🔄 Manual rejoin triggered");
                setParticipantLeft(false);
                setIsLoading(true);
                await onRejoin();
                setTimeout(() => setIsLoading(false), 2000);
              }}
              className="px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-lg shadow-blue-600/30"
            >
              <RefreshCw className="w-5 h-5" />
              Rejoin Meeting
            </button>
          )}
        </div>
      </div>
    );
  }

  // Active video screen
  return (
    <div className="relative w-full md:w-3/4 lg:w-2/3 aspect-video mx-auto my-1 p-2 group">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg z-20 backdrop-blur-sm">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-white text-sm font-medium">Loading video stream...</p>
        </div>
      )}
      
      {/* Video Element with debug info */}
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover rounded-lg bg-gradient-to-br from-gray-900 to-black"
        style={{ backgroundColor: "#000" }}
      />
      
      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute bottom-4 left-4 px-2 py-1 rounded bg-black/70 backdrop-blur-sm text-[10px] text-green-400 font-mono z-30">
          Tracks: {streamTracks} | Stream: {hasStream ? "✅" : "❌"}
        </div>
      )}
      
      {/* Connection Status */}
      <div className="absolute top-4 right-4 px-2 py-1 rounded bg-green-500/20 backdrop-blur-sm text-green-300 text-xs font-medium z-10">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span>Connected</span>
        </div>
      </div>
    </div>
  );
}

export default MainVideo;