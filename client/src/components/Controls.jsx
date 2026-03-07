import { useState } from "react";

function Controls({ stream }) {
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
    <div
      style={{
        padding: "1rem",
        display: "flex",
        justifyContent: "center",
        gap: "20px",
      }}
    >
      <button onClick={toggleMic}>
        {micOn ? "🎤" : "🔇"}
      </button>

      <button onClick={toggleCam}>
        {camOn ? "📷" : "🚫"}
      </button>

      <button>🖥️</button>

      <button
        style={{
          background: "red",
          color: "white",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
        }}
      >
        End Call
      </button>
    </div>
  );
}

export default Controls;