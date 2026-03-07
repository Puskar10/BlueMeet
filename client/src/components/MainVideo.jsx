import { useEffect, useRef } from "react";

function MainVideo({ remoteStream }) {
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    const video = remoteVideoRef.current;
    if (!video || !remoteStream) return;

    // attach stream
    if (video.srcObject !== remoteStream) {
      video.srcObject = remoteStream;
      console.log("RemoteStream attached:", remoteStream);
    }

    console.log("Tracks count:", remoteStream.getTracks().length);

    const playVideo = async () => {
      try {
        await video.play();
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Remote playback error:", err);
        }
      }
    };

    playVideo();

    const handleAddTrack = () => {
      console.log("New track added");
      video.srcObject = remoteStream;
      playVideo();
    };

    remoteStream.addEventListener("addtrack", handleAddTrack);

    return () => {
      remoteStream.removeEventListener("addtrack", handleAddTrack);
    };
  }, [remoteStream]);

  return (
    <video
      ref={remoteVideoRef}
      autoPlay
      playsInline
      className="w-full md:w-3/4 lg:w-2/3 aspect-video mx-auto my-1 p-2 object-cover rounded-lg bg-blue-950"
    />
  );
}

export default MainVideo;