import { useState, useRef, useEffect } from "react";
import socket from "../socket";

const useWebRTC = (roomId, joined) => {
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const localVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const iceQueue = useRef([]);
  const isActive = useRef(false);
  const rejoinTimeoutRef = useRef(null);
  const remoteMediaStream = useRef(null);
  const isRejoining = useRef(false);
  const hasCreatedOffer = useRef(false);

  // ✅ FIX 1: roomIdRef so socket handlers always read the current roomId,
  // never a stale closure snapshot.
  const roomIdRef = useRef(roomId);
  useEffect(() => { roomIdRef.current = roomId; }, [roomId]);

  /* =========================
     1️⃣ START / STOP CAMERA
  ========================== */
  useEffect(() => {
    if (!joined) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      return;
    }

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

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [joined]);

  /* =========================
     2️⃣ PEER CONNECTION & SIGNALING
  ========================== */
  useEffect(() => {
    if (!joined || !stream) {
      isActive.current = false;
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
      return;
    }

    const initializePeerConnection = () => {
      if (rejoinTimeoutRef.current) {
        clearTimeout(rejoinTimeoutRef.current);
        rejoinTimeoutRef.current = null;
      }

      isActive.current = true;
      hasCreatedOffer.current = false;

      if (socket && socket.connected) {
        console.log("Emitting join-room for room:", roomIdRef.current);
        socket.emit("join-room", roomIdRef.current);
      } else if (socket) {
        console.log("Socket not connected, connecting...");
        socket.connect();
        socket.once("connect", () => {
          console.log("Socket connected, joining room:", roomIdRef.current);
          socket.emit("join-room", roomIdRef.current);
        });
      }

      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
        ],
      });
      peerConnection.current = pc;
      iceQueue.current = [];

      stream.getTracks().forEach(track => {
        console.log("Adding local track:", track.kind);
        pc.addTrack(track, stream);
      });

      if (!remoteMediaStream.current) {
        remoteMediaStream.current = new MediaStream();
        console.log("Created new remote MediaStream");
      }

      pc.ontrack = (event) => {
        if (!isActive.current) return;
        console.log("🎥 Remote track received:", event.track.kind);
        remoteMediaStream.current.addTrack(event.track);
        console.log("Total tracks in remote stream:", remoteMediaStream.current.getTracks().length);
        const newStream = new MediaStream(remoteMediaStream.current.getTracks());
        setRemoteStream(newStream);
        console.log("✅ Updated remote stream with", newStream.getTracks().length, "tracks");
        isRejoining.current = false;
      };

      pc.onicecandidate = (event) => {
        if (event.candidate && isActive.current && socket && socket.connected) {
          console.log("Sending ICE candidate:", event.candidate.type);
          socket.emit("ice-candidate", { candidate: event.candidate, roomId: roomIdRef.current });
        }
      };

      pc.oniceconnectionstatechange = () => {
        console.log("ICE Connection State:", pc.iceConnectionState);
        if (pc.iceConnectionState === "connected") {
          console.log("✅ ICE connection established!");
          isRejoining.current = false;
        } else if (pc.iceConnectionState === "failed") {
          console.log("❌ ICE connection failed");
          if (isActive.current && !isRejoining.current) {
            setTimeout(() => rejoinMeeting(), 2000);
          }
        }
      };

      pc.onconnectionstatechange = () => {
        console.log("Connection State:", pc.connectionState);
        if (pc.connectionState === "connected") {
          console.log("✅ Peer connection established!");
          isRejoining.current = false;
        } else if (pc.connectionState === "failed") {
          console.log("❌ Peer connection failed");
          if (isActive.current && !isRejoining.current) {
            setTimeout(() => rejoinMeeting(), 2000);
          }
        } else if (pc.connectionState === "disconnected") {
          console.log("⚠️ Peer connection disconnected");
        }
      };

      pc.onsignalingstatechange = () => {
        console.log("Signaling State:", pc.signalingState);
      };
    };

    initializePeerConnection();

    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
    };
  }, [joined, stream, roomId]);

  /* =========================
     3️⃣ SOCKET EVENTS
  ========================== */
  useEffect(() => {
    if (!socket) return;

    const handleReady = async () => {
      console.log("🎯 Ready event received from server!");

      if (!isActive.current) {
        console.log("Not active, ignoring ready");
        return;
      }

      // ✅ FIX 2: Guard PC existence AND signalingState before doing anything.
      // Do NOT snapshot `pc` into a local variable here — read the ref fresh
      // after every await, since the PC can be replaced while we're suspended.
      if (!peerConnection.current || peerConnection.current.signalingState === "closed") {
        console.log("PC not ready, ignoring ready event");
        return;
      }

      if (hasCreatedOffer.current) {
        console.log("Already created offer, skipping");
        return;
      }

      // Small delay to ensure both users are ready
      await new Promise(resolve => setTimeout(resolve, 100));

      // ✅ FIX 3: Re-read the ref after every await — the PC may have been
      // closed/replaced during the suspension above.
      if (!peerConnection.current || peerConnection.current.signalingState === "closed") {
        console.log("PC closed during delay, aborting offer");
        return;
      }

      if (peerConnection.current.signalingState !== "stable") {
        console.log("Signaling state not stable, waiting...");
        await new Promise(resolve => setTimeout(resolve, 500));

        // ✅ Re-read again after second await
        if (!peerConnection.current || peerConnection.current.signalingState === "closed") {
          console.log("PC closed during stability wait, aborting offer");
          return;
        }
      }

      try {
        hasCreatedOffer.current = true;
        // ✅ Always use peerConnection.current here, not a stale `pc` local var
        const offer = await peerConnection.current.createOffer();

        // ✅ Re-read after the async createOffer call too
        if (!peerConnection.current || peerConnection.current.signalingState === "closed") {
          console.log("PC closed after createOffer, aborting");
          hasCreatedOffer.current = false;
          return;
        }

        await peerConnection.current.setLocalDescription(offer);
        console.log("Offer created and set");

        if (socket.connected) {
          socket.emit("offer", { offer, roomId: roomIdRef.current });
          console.log("Offer sent to server");
        }
      } catch (err) {
        console.error("Error creating offer:", err);
        hasCreatedOffer.current = false;
      }
    };

    const handleOffer = async (offer) => {
      console.log("📥 Offer received");

      if (!isActive.current) {
        console.log("Not active, ignoring offer");
        return;
      }

      const pc = peerConnection.current;
      if (!pc) {
        console.log("No peer connection available");
        return;
      }

      if (pc.localDescription) {
        console.log("Already have local description, ignoring offer");
        return;
      }

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        console.log("Remote description set from offer");

        if (iceQueue.current.length > 0) {
          console.log("Processing queued ICE candidates:", iceQueue.current.length);
          for (const candidate of iceQueue.current) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
          iceQueue.current = [];
        }

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        console.log("Answer created and set");

        if (socket.connected) {
          socket.emit("answer", { answer, roomId: roomIdRef.current });
          console.log("Answer sent to server");
        }
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    };

    const handleAnswer = async (answer) => {
      console.log("📥 Answer received");

      if (!isActive.current) {
        console.log("Not active, ignoring answer");
        return;
      }

      const pc = peerConnection.current;
      if (!pc) {
        console.log("No peer connection available");
        return;
      }

      if (!pc.localDescription || pc.localDescription.type !== "offer") {
        console.log("No pending offer, ignoring answer");
        return;
      }

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        console.log("Remote description set from answer");

        if (iceQueue.current.length > 0) {
          console.log("Processing queued ICE candidates:", iceQueue.current.length);
          for (const candidate of iceQueue.current) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
          iceQueue.current = [];
        }
      } catch (err) {
        console.error("Error handling answer:", err);
      }
    };

    const handleIce = async (candidate) => {
      if (!isActive.current) return;
      const pc = peerConnection.current;
      if (!pc) return;

      try {
        if (pc.remoteDescription) {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("ICE candidate added");
        } else {
          console.log("Queueing ICE candidate");
          iceQueue.current.push(candidate);
        }
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    };

    const handleRoomFull = () => {
      alert("Room is full (1-to-1 only). Please try another room.");
    };

    const handleUserLeft = () => {
      console.log("User left the room");
      if (remoteMediaStream.current) {
        remoteMediaStream.current.getTracks().forEach(track => track.stop());
        remoteMediaStream.current = new MediaStream();
        setRemoteStream(null);
      }
    };

    socket.on("ready", handleReady);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIce);
    socket.on("room-full", handleRoomFull);
    socket.on("user-left", handleUserLeft);

    console.log("Socket event listeners registered");

    return () => {
      socket.off("ready", handleReady);
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIce);
      socket.off("room-full", handleRoomFull);
      socket.off("user-left", handleUserLeft);
    };
  }, [roomId]);

  /* =========================
     4️⃣ ATTACH LOCAL VIDEO
  ========================== */
  useEffect(() => {
    if (localVideoRef.current && stream) {
      localVideoRef.current.srcObject = stream;
    }

    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const oldStream = localVideoRef.current.srcObject;
        if (oldStream && oldStream.getTracks) {
          oldStream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, [stream]);

  /* =========================
     5️⃣ SCREEN SHARE
  ========================== */
  const toggleScreenShare = async () => {
    const pc = peerConnection.current;
    if (!pc || !stream) return;

    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenTrack = screenStream.getVideoTracks()[0];
        const sender = pc.getSenders().find(s => s.track && s.track.kind === "video");
        if (sender) {
          await sender.replaceTrack(screenTrack);
        }
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);

        screenTrack.onended = () => {
          if (isScreenSharing) {
            switchBackToCamera();
          }
        };
      } else {
        await switchBackToCamera();
      }
    } catch (err) {
      console.log("Screen share error:", err);
    }
  };

  const switchBackToCamera = async () => {
    const pc = peerConnection.current;
    if (!pc || !stream) return;

    const cameraTrack = stream.getVideoTracks()[0];
    if (cameraTrack) {
      const sender = pc.getSenders().find(s => s.track && s.track.kind === "video");
      if (sender) {
        await sender.replaceTrack(cameraTrack);
      }
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    setIsScreenSharing(false);
  };

  /* =========================
     6️⃣ LEAVE MEETING
  ========================== */
  const leaveMeeting = () => {
    console.log("Leaving meeting...");
    isActive.current = false;
    isRejoining.current = false;
    hasCreatedOffer.current = false;

    if (rejoinTimeoutRef.current) {
      clearTimeout(rejoinTimeoutRef.current);
      rejoinTimeoutRef.current = null;
    }

    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (remoteMediaStream.current) {
      remoteMediaStream.current.getTracks().forEach(track => track.stop());
      remoteMediaStream.current = null;
    }

    iceQueue.current = [];

    if (socket && socket.connected) {
      socket.emit("leave-room", roomIdRef.current);
    }

    setRemoteStream(null);
    setStream(null);
  };

  /* =========================
     7️⃣ REJOIN MEETING
  ========================== */
  const rejoinMeeting = async () => {
    if (isRejoining.current) {
      console.log("Already rejoining, skipping...");
      return;
    }

    console.log("Attempting to rejoin meeting...");
    isRejoining.current = true;
    hasCreatedOffer.current = false;

    if (rejoinTimeoutRef.current) {
      clearTimeout(rejoinTimeoutRef.current);
      rejoinTimeoutRef.current = null;
    }

    const currentStream = stream;

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (remoteMediaStream.current) {
      remoteMediaStream.current.getTracks().forEach(track => track.stop());
      remoteMediaStream.current = new MediaStream();
    }

    iceQueue.current = [];
    setRemoteStream(null);

    await new Promise(resolve => setTimeout(resolve, 500));

    let activeStream = currentStream;
    if (!activeStream || activeStream.getTracks().length === 0) {
      try {
        console.log("Re-acquiring camera stream...");
        activeStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(activeStream);
      } catch (err) {
        console.error("Failed to get camera for rejoin:", err);
        isRejoining.current = false;
        return;
      }
    }

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });
    peerConnection.current = pc;

    activeStream.getTracks().forEach(track => {
      console.log("Re-adding local track:", track.kind);
      pc.addTrack(track, activeStream);
    });

    remoteMediaStream.current = new MediaStream();

    pc.ontrack = (event) => {
      if (!isActive.current) return;
      console.log("🎥 Remote track received during rejoin:", event.track.kind);
      remoteMediaStream.current.addTrack(event.track);
      const newStream = new MediaStream(remoteMediaStream.current.getTracks());
      setRemoteStream(newStream);
      console.log("✅ Remote stream restored with", newStream.getTracks().length, "tracks");
      isRejoining.current = false;
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && isActive.current && socket && socket.connected) {
        socket.emit("ice-candidate", { candidate: event.candidate, roomId: roomIdRef.current });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("Rejoin ICE State:", pc.iceConnectionState);
      if (pc.iceConnectionState === "connected") {
        console.log("✅ Rejoin successful!");
        isRejoining.current = false;
      } else if (pc.iceConnectionState === "failed") {
        console.log("❌ Rejoin failed");
        isRejoining.current = false;
      }
    };

    if (socket && socket.connected) {
      console.log("Re-emitting join-room");
      socket.emit("join-room", roomIdRef.current);
    } else if (socket) {
      socket.connect();
      socket.once("connect", () => {
        console.log("Socket reconnected, joining room");
        socket.emit("join-room", roomIdRef.current);
      });
    }

    rejoinTimeoutRef.current = setTimeout(() => {
      if (isRejoining.current) {
        console.log("Rejoin timeout, resetting flag");
        isRejoining.current = false;
      }
    }, 10000);
  };

  return {
    localVideoRef,
    remoteStream,
    stream,
    leaveMeeting,
    rejoinMeeting,
    toggleScreenShare,
    isScreenSharing,
  };
};

export default useWebRTC;