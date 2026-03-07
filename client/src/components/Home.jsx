import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Video,
  Users,
  Key,
  ArrowRight,
  Sparkles,
  Shield,
  Wifi,
  Clock,
} from "lucide-react";

function Home({ setJoined, setRoomId, setUserName }) {
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const joinMeeting = () => {
    if (!room || !name) return;

    setRoomId(room);
    setUserName(name);
    setJoined(true);
    navigate(`/room/${room}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && room && name) {
      joinMeeting();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,100,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,100,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-800 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-1000"></div>

      {/* Floating particles */}
      <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-30"></div>
      <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-blue-600 rounded-full animate-ping animation-delay-500 opacity-30"></div>

      {/* Main card - wider width */}
      <div className="relative w-full max-w-2xl">
        {/* Glowing border effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 rounded-3xl blur opacity-30 animate-pulse"></div>

        {/* Main card with dark theme */}
        <div className="relative bg-gradient-to-br from-gray-900 via-blue-950 to-black rounded-3xl shadow-2xl p-10 border border-blue-500/30 backdrop-blur-xl">
          {/* Header with icon */}
          <div className="text-center mb-10">
            <div className="inline-flex p-5 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl mb-5 shadow-lg shadow-blue-500/30">
              <Video className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Blue<span className="text-blue-400">Meet</span>
            </h1>
            <p className="text-blue-200/70 text-base">
              Secure, high-quality video meetings for everyone
            </p>
          </div>

          {/* Form fields */}
          <div className="space-y-6">
            {/* Name input */}
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-blue-200 flex items-center gap-2 ml-1">
                <Users className="w-4 h-4 text-blue-400" />
                Your Name
              </label>
              <div
                className={`relative transition-all duration-300 ${
                  focusedField === "name" ? "transform scale-[1.02]" : ""
                }`}
              >
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  onKeyPress={handleKeyPress}
                  className="w-full p-5 pl-6 pr-14 bg-black/50 border-2 border-blue-500/30 rounded-2xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all text-lg"
                />
                {name && (
                  <Sparkles className="absolute right-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400 animate-pulse" />
                )}
              </div>
            </div>

            {/* Room ID input */}
            <div className="space-y-2.5">
              <label className="text-sm font-semibold text-blue-200 flex items-center gap-2 ml-1">
                <Key className="w-4 h-4 text-blue-400" />
                Room ID
              </label>
              <div
                className={`relative transition-all duration-300 ${
                  focusedField === "room" ? "transform scale-[1.02]" : ""
                }`}
              >
                <input
                  type="text"
                  placeholder="Enter room ID (e.g., team-meeting-123)"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  onFocus={() => setFocusedField("room")}
                  onBlur={() => setFocusedField(null)}
                  onKeyPress={handleKeyPress}
                  className="w-full p-5 pl-6 bg-black/50 border-2 border-blue-500/30 rounded-2xl text-white placeholder-blue-300/30 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all text-lg"
                />
              </div>
            </div>

            {/* Join button */}
            <button
              onClick={joinMeeting}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              disabled={!room || !name}
              className={`w-full mt-8 py-5 px-6 rounded-2xl font-bold text-white text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                room && name
                  ? "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transform hover:-translate-y-1 border border-blue-400/50"
                  : "bg-gray-800 cursor-not-allowed opacity-50 border border-gray-700"
              }`}
            >
              <span>Join Meeting</span>
              <ArrowRight
                className={`w-6 h-6 transition-all duration-300 ${
                  isHovered && room && name ? "translate-x-2" : ""
                }`}
              />
            </button>

            {/* Feature grid */}
            <div className="grid grid-cols-3 gap-3 mt-8">
              <div className="p-3 bg-blue-950/50 rounded-xl border border-blue-500/20 backdrop-blur-sm">
                <Shield className="w-5 h-5 text-blue-400 mb-2" />
                <p className="text-xs font-medium text-blue-200">
                  End-to-end encrypted
                </p>
              </div>
              <div className="p-3 bg-blue-950/50 rounded-xl border border-blue-500/20 backdrop-blur-sm">
                <Wifi className="w-5 h-5 text-blue-400 mb-2" />
                <p className="text-xs font-medium text-blue-200">HD quality</p>
              </div>
              <div className="p-3 bg-blue-950/50 rounded-xl border border-blue-500/20 backdrop-blur-sm">
                <Clock className="w-5 h-5 text-blue-400 mb-2" />
                <p className="text-xs font-medium text-blue-200">
                  No time limits
                </p>
              </div>
            </div>

            {/* Quick tips */}
            <div className="mt-6 p-5 bg-gradient-to-r from-blue-950/50 to-black/50 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
              <p className="text-sm text-blue-200 flex items-center gap-3">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                Create a new room by entering a unique ID
              </p>
              <p className="text-sm text-blue-200 flex items-center gap-3 mt-3">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-300"></span>
                Share the room ID with others to invite them
              </p>
              <p className="text-sm text-blue-200 flex items-center gap-3 mt-3">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse animation-delay-700"></span>
                No account needed - just enter your name and join
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-blue-300/50 flex items-center justify-center gap-4">
              <span>Secure</span>
              <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
              <span>HD Video</span>
              <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
              <span>Free</span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        .animation-delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  );
}

export default Home;
