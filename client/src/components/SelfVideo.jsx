import { useEffect } from "react";

function SelfVideo({ videoRef, stream }) {

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="absolute top-5 right-5 w-60 h-40 bg-black rounded-xl border-2 border-blue-500"
    />
  );
}

export default SelfVideo;