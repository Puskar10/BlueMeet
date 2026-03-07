import { useState, useRef, useEffect } from "react";
import socket from "../socket";

const useWebRTC = (roomId, joined) => {
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const localVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const iceQueue = useRef([]);

  /* =========================
     1️⃣ START CAMERA
  ========================== */

  useEffect(() => {
    if (!joined) return;

    const startCamera = async () => {
      try {
        const media = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setStream(media);
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startCamera();
  }, [joined]);

  /* =========================
     2️⃣ CREATE PEER CONNECTION
  ========================== */

  useEffect(() => {
    if (!joined || !stream) return;

    socket.emit("join-room", roomId);

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.current = pc;

    /* ---------- ADD LOCAL TRACKS ---------- */

    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });

    /* ---------- CREATE REMOTE STREAM ---------- */

    const remoteMedia = new MediaStream();
    setRemoteStream(remoteMedia);

    pc.ontrack = (event) => {
      console.log("Remote track:", event.track.kind);

      remoteMedia.addTrack(event.track);

      // update state so React re-renders
      setRemoteStream(new MediaStream(remoteMedia.getTracks()));
    };

    /* ---------- ICE ---------- */

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          roomId,
        });
      }
    };

    return () => {
      pc.close();
    };
  }, [joined, stream, roomId]);

  /* =========================
     3️⃣ SOCKET EVENTS
  ========================== */

  useEffect(() => {
    const handleReady = async () => {
      const pc = peerConnection.current;
      if (!pc) return;

      console.log("Second user joined → Creating offer");

      if (pc.signalingState !== "stable") return;

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("offer", { offer, roomId });
    };

    const handleOffer = async (offer) => {
      const pc = peerConnection.current;
      if (!pc) return;

      console.log("Offer received");

      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      for (const candidate of iceQueue.current) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }

      iceQueue.current = [];

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer", { answer, roomId });
    };

    const handleAnswer = async (answer) => {
      const pc = peerConnection.current;
      if (!pc) return;

      console.log("Answer received");

      await pc.setRemoteDescription(new RTCSessionDescription(answer));

      for (const candidate of iceQueue.current) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }

      iceQueue.current = [];
    };

    const handleIce = async (candidate) => {
      const pc = peerConnection.current;
      if (!pc) return;

      if (pc.remoteDescription) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        iceQueue.current.push(candidate);
      }
    };

    const handleRoomFull = () => {
      alert("Room full (1-to-1 only)");
    };

    socket.on("ready", handleReady);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIce);
    socket.on("room-full", handleRoomFull);

    return () => {
      socket.off("ready", handleReady);
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIce);
      socket.off("room-full", handleRoomFull);
    };
  }, [roomId]);

  /* =========================
     4️⃣ ATTACH LOCAL VIDEO
  ========================== */

  useEffect(() => {
    if (localVideoRef.current && stream) {
      localVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  /* =========================
     5️⃣ SCREEN SHARE
  ========================== */

  const toggleScreenShare = async () => {
    const pc = peerConnection.current;
    if (!pc) return;

    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        const screenTrack = screenStream.getVideoTracks()[0];

        const sender = pc
          .getSenders()
          .find((s) => s.track && s.track.kind === "video");

        if (sender) {
          sender.replaceTrack(screenTrack);
        }

        localVideoRef.current.srcObject = screenStream;
        setIsScreenSharing(true);

        screenTrack.onended = () => {
          switchBackToCamera();
        };
      } else {
        switchBackToCamera();
      }
    } catch (err) {
      console.log("Screen share error:", err);
    }
  };

  const switchBackToCamera = async () => {
    const pc = peerConnection.current;
    if (!pc || !stream) return;

    const cameraTrack = stream.getVideoTracks()[0];

    const sender = pc
      .getSenders()
      .find((s) => s.track && s.track.kind === "video");

    if (sender) {
      await sender.replaceTrack(cameraTrack);
    }

    localVideoRef.current.srcObject = stream;
    setIsScreenSharing(false);
  };

  /* =========================
     6️⃣ LEAVE MEETING
  ========================== */

  const leaveMeeting = () => {
    stream?.getTracks().forEach((track) => track.stop());
    console.log("Local tracks stopped");

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    iceQueue.current = [];

    setStream(null);
    setRemoteStream(null);

    // Disconnect socket
    if (socket.current) {
      socket.current.disconnect();
    }
  };

  return {
    localVideoRef,
    remoteStream,
    stream,
    leaveMeeting,
    toggleScreenShare,
    isScreenSharing,
  };
};

export default useWebRTC;
