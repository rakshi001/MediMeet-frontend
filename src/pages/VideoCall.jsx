import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
const socket = io("https://medifypro-backend.onrender.com"); 

const VideoCall = () => {
  const localVideo = useRef();
  const remoteVideo = useRef();
  const peerConnection = useRef(null);
  const localStream = useRef(null);
  const [joined, setJoined] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [remoteAudioEnabled, setRemoteAudioEnabled] = useState(true);
  const [remoteVideoEnabled, setRemoteVideoEnabled] = useState(true);

  const { roomID } = useParams();

  const config = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    socket.on("user-joined", handleUserJoined);
    socket.on("offer", handleReceiveOffer);
    socket.on("answer", handleReceiveAnswer);
    socket.on("ice-candidate", handleNewICECandidate);

    socket.on("remote-toggle-audio", ({ enabled }) =>
      setRemoteAudioEnabled(enabled)
    );
    socket.on("remote-toggle-video", ({ enabled }) =>
      setRemoteVideoEnabled(enabled)
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  const startCall = async () => {
    setJoined(true);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStream.current = stream;
    localVideo.current.srcObject = stream;

    peerConnection.current = new RTCPeerConnection(config);

    stream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, stream);
    });

    peerConnection.current.ontrack = (event) => {
      remoteVideo.current.srcObject = event.streams[0];
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { roomID, candidate: event.candidate });
      }
    };

    socket.emit("join-video-room", roomID);
  };

  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (localVideo.current && localVideo.current.srcObject) {
      localVideo.current.srcObject.getTracks().forEach((track) => track.stop());
      localVideo.current.srcObject = null;
    }

    if (remoteVideo.current && remoteVideo.current.srcObject) {
      remoteVideo.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
      remoteVideo.current.srcObject = null;
    }

    localStream.current = null;
    setJoined(false);
    setAudioEnabled(true);
    setVideoEnabled(true);

    socket.emit("end-call", { roomID });
    console.log("Call ended");
  };

  const toggleAudio = () => {
    const track = localStream.current?.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setAudioEnabled(track.enabled);
      socket.emit("toggle-audio", { roomID, enabled: track.enabled });
    }
  };

  const toggleVideo = () => {
    const track = localStream.current?.getVideoTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setVideoEnabled(track.enabled);
      socket.emit("toggle-video", { roomID, enabled: track.enabled });
    }
  };

  const handleUserJoined = async () => {
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit("offer", { roomID, offer });
  };

  const handleReceiveOffer = async (offer) => {
    await peerConnection.current.setRemoteDescription(
      new window.RTCSessionDescription(offer)
    );

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStream.current = stream;
    localVideo.current.srcObject = stream;

    stream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, stream);
    });

    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    socket.emit("answer", { roomID, answer });
  };

  const handleReceiveAnswer = async (answer) => {
    await peerConnection.current.setRemoteDescription(
      new window.RTCSessionDescription(answer)
    );
  };

  const handleNewICECandidate = async (candidate) => {
    try {
      await peerConnection.current.addIceCandidate(
        new window.RTCIceCandidate(candidate)
      );
    } catch (error) {
      console.error("Error adding received ice candidate", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-violet-100 to-indigo-200">
      <div className="mb-6 mt-8 flex flex-wrap gap-4">
        {!joined ? (
          <button
            onClick={startCall}
            className="px-6 py-3 rounded-lg text-lg font-semibold shadow bg-violet-600 text-white hover:bg-violet-700"
          >
            Start Call
          </button>
        ) : (
          <>
            <div className="flex flex-wrap gap-4">
              {/* End Call */}
              <button
                onClick={endCall}
                className="px-6 py-3 rounded-lg text-lg font-semibold shadow bg-red-600 text-white hover:bg-red-700"
              >
                End Call
              </button>

              {/* Toggle Audio */}
              <button
                onClick={toggleAudio}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium shadow transition ${
                  audioEnabled
                    ? "bg-violet-100 text-violet-700 hover:bg-violet-200"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {audioEnabled ? (
                  <Mic className="w-5 h-5" />
                ) : (
                  <MicOff className="w-5 h-5" />
                )}
                {audioEnabled ? "Mute Audio" : "Unmute Audio"}
              </button>

              {/* Toggle Video */}
              <button
                onClick={toggleVideo}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium shadow transition ${
                  videoEnabled
                    ? "bg-violet-100 text-violet-700 hover:bg-violet-200"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {videoEnabled ? (
                  <Video className="w-5 h-5" />
                ) : (
                  <VideoOff className="w-5 h-5" />
                )}
                {videoEnabled ? "Turn Off Video" : "Turn On Video"}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full">
        <div className="flex flex-col items-center">
          <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-violet-300 bg-white">
            <video
              ref={localVideo}
              autoPlay
              muted
              playsInline
              style={{ width: "420px", height: "320px", background: "#e5e7fa" }}
              className="object-cover"
            />
          </div>
          <span className="mt-3 text-lg font-medium text-violet-700">You</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-indigo-300 bg-white">
            <video
              ref={remoteVideo}
              autoPlay
              playsInline
              style={{ width: "420px", height: "320px", background: "#e5e7fa" }}
              className="object-cover"
            />
            {!remoteVideoEnabled && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
                <span className="text-white text-2xl font-bold mb-2">
                  Video Off
                </span>
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2z"
                  />
                </svg>
              </div>
            )}
            {!remoteAudioEnabled && (
              <div className="absolute bottom-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19V6a3 3 0 016 0v13m-6 0a3 3 0 006 0m-6 0H5a2 2 0 01-2-2v-5a2 2 0 012-2h2m10 0h2a2 2 0 012 2v5a2 2 0 01-2 2h-4"
                  />
                </svg>
                Muted
              </div>
            )}
          </div>
          <span className="mt-3 text-lg font-medium text-indigo-700">
            Doctor
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
