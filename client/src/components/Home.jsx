import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Video,
  Users,
  Key,
  ArrowRight,
  Sparkles,
  Shield,
  Wifi,
  Clock,
  Copy,
  Check,
  History,
  Trash2,
  Plus,
  LogIn,
  Star,
  TrendingUp,
  Zap,
  Award,
  Globe,
  Lock,
  Share2,
} from "lucide-react";

function Home({ setJoined, setRoomId, setUserName }) {
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [recentRooms, setRecentRooms] = useState([]);
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [suggestedRooms] = useState([
    "team-sync-2024",
    "design-review",
    "client-meeting",
    "daily-standup",
  ]);
  const navigate = useNavigate();

  // Load recent rooms from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      setName(savedName);
    }

    const recent = localStorage.getItem("recentRooms");
    if (recent) {
      setRecentRooms(JSON.parse(recent));
    }
  }, []);

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const saveRecentRoom = (roomId, userName) => {
    const recent = JSON.parse(localStorage.getItem("recentRooms") || "[]");
    const newEntry = {
      id: roomId,
      name: userName,
      timestamp: new Date().toISOString(),
      lastUsed: new Date().getTime(),
    };
    
    // Remove duplicate if exists
    const filtered = recent.filter((r) => r.id !== roomId);
    const updated = [newEntry, ...filtered].slice(0, 5); // Keep only last 5
    localStorage.setItem("recentRooms", JSON.stringify(updated));
    setRecentRooms(updated);
  };

  const clearRecentRooms = () => {
    localStorage.removeItem("recentRooms");
    setRecentRooms([]);
    showToastMessage("Recent rooms cleared");
  };

  const joinMeeting = () => {
    if (!room.trim() || !name.trim()) {
      showToastMessage("Please enter both name and room ID");
      return;
    }

    // Validate room ID format (alphanumeric and hyphens only)
    const roomRegex = /^[a-zA-Z0-9-]+$/;
    if (!roomRegex.test(room)) {
      showToastMessage("Room ID can only contain letters, numbers, and hyphens");
      return;
    }

    // Validate name length
    if (name.length < 2) {
      showToastMessage("Please enter your full name (min 2 characters)");
      return;
    }

    // Save to localStorage
    localStorage.setItem("roomId", room);
    localStorage.setItem("userName", name);
    
    // Save to recent rooms
    saveRecentRoom(room, name);
    
    // Update state
    setRoomId(room);
    setUserName(name);
    setJoined(true);
    
    // Show success message before navigation
    showToastMessage(`Joining "${room}" as ${name}...`);
    
    // Small delay for toast to show
    setTimeout(() => {
      navigate(`/room/${room}`);
    }, 300);
  };

  const joinRecentRoom = (recentRoom) => {
    setRoom(recentRoom.id);
    setName(recentRoom.name);
    joinMeeting();
  };

  const generateRandomRoom = () => {
    const adjectives = ["swift", "bright", "cool", "epic", "super", "mega", "ultra", "pro"];
    const nouns = ["meeting", "huddle", "space", "lounge", "hub", "zone", "arena"];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 1000);
    const newRoom = `${randomAdj}-${randomNoun}-${randomNum}`;
    setRoom(newRoom);
    showToastMessage(`Generated room ID: ${newRoom}`);
  };

  const copyRoomId = () => {
    if (room) {
      navigator.clipboard.writeText(room);
      setCopied(true);
      showToastMessage("Room ID copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && room && name) {
      joinMeeting();
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 animate-slide-down">
          <div className={`${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          } rounded-xl shadow-2xl px-6 py-3 flex items-center gap-3 border backdrop-blur-xl`}>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className={`${darkMode ? "text-gray-200" : "text-gray-700"} text-sm font-medium`}>
              {toastMessage}
            </p>
          </div>
        </div>
      )}

      <div className={`min-h-screen transition-all duration-500 ${
        darkMode 
          ? "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" 
          : "bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100"
      } flex items-center justify-center p-4 relative overflow-hidden`}>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        {/* Background grid */}
        <div className={`absolute inset-0 ${
          darkMode 
            ? "bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)]" 
            : "bg-[linear-gradient(rgba(59,130,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)]"
        } bg-[size:64px_64px]`}></div>

        {/* Floating particles */}
        <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping animation-delay-1000 opacity-40"></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse animation-delay-2000 opacity-30"></div>

        {/* Main container */}
        <div className="relative w-full max-w-6xl z-10">
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Left Column - Main Form */}
            <div className="space-y-6">
              {/* Main card */}
              <div className={`relative backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
                darkMode 
                  ? "bg-gradient-to-br from-gray-900/90 via-blue-950/90 to-black/90 border border-blue-500/30" 
                  : "bg-white/90 border border-blue-200/50"
              }`}>
                
                {/* Header */}
                <div className="relative p-8 pb-0">
                  <div className="flex justify-between items-start mb-6">
                    <div className="inline-flex p-3 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg shadow-blue-500/30">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`p-2 rounded-lg transition-all ${
                        darkMode 
                          ? "bg-gray-800 hover:bg-gray-700 text-yellow-400" 
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      {darkMode ? "🌞" : "🌙"}
                    </button>
                  </div>
                  
                  <h1 className={`text-4xl lg:text-5xl font-bold mb-3 transition-colors ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}>
                    Blue<span className="text-blue-600">Meet</span>
                  </h1>
                  <p className={`text-base transition-colors ${
                    darkMode ? "text-blue-200/80" : "text-gray-600"
                  }`}>
                    Premium HD video conferencing with crystal clear quality
                  </p>
                  
                  {/* Stats badges */}
                  <div className="flex gap-3 mt-6 flex-wrap">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                      darkMode 
                        ? "bg-blue-950/50 text-blue-300 border border-blue-500/30" 
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      <Users className="w-3.5 h-3.5" />
                      <span>Up to 100 participants</span>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                      darkMode 
                        ? "bg-purple-950/50 text-purple-300 border border-purple-500/30" 
                        : "bg-purple-50 text-purple-700 border border-purple-200"
                    }`}>
                      <Lock className="w-3.5 h-3.5" />
                      <span>End-to-end encrypted</span>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="p-8 pt-6 space-y-5">
                  {/* Name input */}
                  <div className="space-y-2">
                    <label className={`text-sm font-semibold flex items-center gap-2 ml-1 transition-colors ${
                      darkMode ? "text-blue-200" : "text-gray-700"
                    }`}>
                      <Users className="w-4 h-4 text-blue-500" />
                      Your Name
                    </label>
                    <div className={`relative transition-all duration-300 ${
                      focusedField === "name" ? "transform scale-[1.01]" : ""
                    }`}>
                      <input
                        type="text"
                        placeholder="e.g., John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        onKeyPress={handleKeyPress}
                        className={`w-full p-4 pl-12 pr-12 rounded-xl transition-all text-base ${
                          darkMode 
                            ? "bg-black/40 border-2 border-blue-500/30 text-white placeholder-blue-300/30 focus:border-blue-400" 
                            : "bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      />
                      <Users className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                        darkMode ? "text-blue-400" : "text-gray-400"
                      }`} />
                      {name && (
                        <Sparkles className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 animate-pulse" />
                      )}
                    </div>
                  </div>

                  {/* Room ID input */}
                  <div className="space-y-2">
                    <label className={`text-sm font-semibold flex items-center gap-2 ml-1 transition-colors ${
                      darkMode ? "text-blue-200" : "text-gray-700"
                    }`}>
                      <Key className="w-4 h-4 text-blue-500" />
                      Room ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g., team-meeting-123"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className={`w-full p-4 pl-12 pr-32 rounded-xl transition-all text-base ${
                          darkMode 
                            ? "bg-black/40 border-2 border-blue-500/30 text-white placeholder-blue-300/30 focus:border-blue-400" 
                            : "bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-400"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                      />
                      <Key className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                        darkMode ? "text-blue-400" : "text-gray-400"
                      }`} />
                      
                      {/* Action buttons */}
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
                        <button
                          onClick={generateRandomRoom}
                          className={`p-1.5 rounded-lg transition-all ${
                            darkMode 
                              ? "bg-blue-950/50 hover:bg-blue-900/50 text-blue-400" 
                              : "bg-gray-100 hover:bg-gray-200 text-blue-600"
                          }`}
                          title="Generate random room ID"
                        >
                          <Zap className="w-4 h-4" />
                        </button>
                        {room && (
                          <button
                            onClick={copyRoomId}
                            className={`p-1.5 rounded-lg transition-all ${
                              darkMode 
                                ? "bg-blue-950/50 hover:bg-blue-900/50 text-blue-400" 
                                : "bg-gray-100 hover:bg-gray-200 text-blue-600"
                            }`}
                            title="Copy room ID"
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Join button */}
                  <button
                    onClick={joinMeeting}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    disabled={!room.trim() || !name.trim()}
                    className={`w-full mt-6 py-4 px-6 rounded-xl font-bold text-white text-base flex items-center justify-center gap-3 transition-all duration-300 ${
                      room && name
                        ? "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transform hover:-translate-y-0.5 border border-blue-400/50 cursor-pointer"
                        : "bg-gray-700 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <span>Join Meeting</span>
                    <ArrowRight className={`w-5 h-5 transition-all duration-300 ${
                      isHovered && room && name ? "translate-x-1" : ""
                    }`} />
                  </button>
                </div>

                {/* Feature badges */}
                <div className="px-8 pb-8">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: Shield, label: "Secure", desc: "End-to-end encrypted" },
                      { icon: Wifi, label: "HD Quality", desc: "1080p video" },
                      { icon: Clock, label: "Unlimited", desc: "No time limits" },
                    ].map((feature, idx) => (
                      <div key={idx} className={`p-3 rounded-xl backdrop-blur-sm transition-all ${
                        darkMode 
                          ? "bg-blue-950/30 border border-blue-500/20 hover:border-blue-500/40" 
                          : "bg-gray-50 border border-gray-200 hover:border-blue-300"
                      }`}>
                        <feature.icon className={`w-5 h-5 mb-2 ${
                          darkMode ? "text-blue-400" : "text-blue-600"
                        }`} />
                        <p className={`text-xs font-bold transition-colors ${
                          darkMode ? "text-blue-200" : "text-gray-700"
                        }`}>{feature.label}</p>
                        <p className={`text-xs opacity-70 ${
                          darkMode ? "text-blue-300/50" : "text-gray-500"
                        }`}>{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick tips */}
              <div className={`p-5 rounded-2xl backdrop-blur-sm transition-all ${
                darkMode 
                  ? "bg-gradient-to-r from-blue-950/30 to-black/30 border border-blue-500/20" 
                  : "bg-white/50 border border-gray-200"
              }`}>
                <p className={`text-sm flex items-center gap-3 mb-3 transition-colors ${
                  darkMode ? "text-blue-200" : "text-gray-700"
                }`}>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <strong>Quick tips:</strong>
                </p>
                <div className="grid sm:grid-cols-2 gap-2">
                  <p className={`text-xs flex items-center gap-2 ${
                    darkMode ? "text-blue-300/70" : "text-gray-600"
                  }`}>
                    <Plus className="w-3 h-3 text-blue-500" />
                    Create a new room with any unique ID
                  </p>
                  <p className={`text-xs flex items-center gap-2 ${
                    darkMode ? "text-blue-300/70" : "text-gray-600"
                  }`}>
                    <Share2 className="w-3 h-3 text-blue-500" />
                    Share room ID to invite others
                  </p>
                  <p className={`text-xs flex items-center gap-2 ${
                    darkMode ? "text-blue-300/70" : "text-gray-600"
                  }`}>
                    <LogIn className="w-3 h-3 text-blue-500" />
                    No account needed - just join
                  </p>
                  <p className={`text-xs flex items-center gap-2 ${
                    darkMode ? "text-blue-300/70" : "text-gray-600"
                  }`}>
                    <History className="w-3 h-3 text-blue-500" />
                    Recently used rooms are saved
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Recent Rooms & Suggestions */}
            <div className="space-y-6">
              {/* Recent rooms */}
              {recentRooms.length > 0 && (
                <div className={`rounded-2xl backdrop-blur-sm overflow-hidden transition-all ${
                  darkMode 
                    ? "bg-gradient-to-br from-gray-900/50 to-black/50 border border-blue-500/20" 
                    : "bg-white/50 border border-gray-200"
                }`}>
                  <div className="p-5 border-b flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <History className={`w-5 h-5 ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      }`} />
                      <h3 className={`font-semibold transition-colors ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}>Recent Rooms</h3>
                    </div>
                    <button
                      onClick={clearRecentRooms}
                      className={`p-1.5 rounded-lg transition-all ${
                        darkMode 
                          ? "hover:bg-red-500/10 text-red-400" 
                          : "hover:bg-red-50 text-red-600"
                      }`}
                      title="Clear all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="divide-y divide-blue-500/10">
                    {recentRooms.map((recent, idx) => (
                      <button
                        key={idx}
                        onClick={() => joinRecentRoom(recent)}
                        className="w-full p-4 text-left hover:bg-blue-500/5 transition-all group"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className={`font-mono text-sm font-medium mb-1 group-hover:text-blue-500 transition-colors ${
                              darkMode ? "text-blue-300" : "text-blue-700"
                            }`}>
                              {recent.id}
                            </p>
                            <p className={`text-xs transition-colors ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}>
                              Joined as: {recent.name}
                            </p>
                            <p className={`text-xs mt-1 ${
                              darkMode ? "text-gray-500" : "text-gray-400"
                            }`}>
                              {new Date(recent.timestamp).toLocaleDateString()} at{" "}
                              {new Date(recent.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                          <ArrowRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all ${
                            darkMode ? "text-blue-400" : "text-blue-600"
                          }`} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested rooms */}
              <div className={`rounded-2xl backdrop-blur-sm p-5 transition-all ${
                darkMode 
                  ? "bg-gradient-to-br from-purple-950/20 to-black/30 border border-purple-500/20" 
                  : "bg-white/50 border border-gray-200"
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  <Star className={`w-5 h-5 ${
                    darkMode ? "text-yellow-400" : "text-yellow-600"
                  }`} />
                  <h3 className={`font-semibold transition-colors ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}>Suggested Rooms</h3>
                </div>
                <div className="space-y-2">
                  {suggestedRooms.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => setRoom(suggestion)}
                      className={`w-full p-3 rounded-xl text-left transition-all flex justify-between items-center group ${
                        darkMode 
                          ? "hover:bg-purple-950/30 text-purple-300" 
                          : "hover:bg-purple-50 text-purple-700"
                      }`}
                    >
                      <span className="font-mono text-sm">{suggestion}</span>
                      <ArrowRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all ${
                        darkMode ? "text-purple-400" : "text-purple-600"
                      }`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust badges */}
              <div className={`text-center p-5 rounded-2xl backdrop-blur-sm transition-all ${
                darkMode 
                  ? "bg-green-950/20 border border-green-500/20" 
                  : "bg-green-50 border border-green-200"
              }`}>
                <div className="flex justify-center gap-6 items-center">
                  <div className="flex items-center gap-2">
                    <Lock className={`w-4 h-4 ${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`} />
                    <p className={`text-xs font-medium ${
                      darkMode ? "text-green-300" : "text-green-700"
                    }`}>GDPR Compliant</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className={`w-4 h-4 ${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`} />
                    <p className={`text-xs font-medium ${
                      darkMode ? "text-green-300" : "text-green-700"
                    }`}>99.9% Uptime</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className={`w-4 h-4 ${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`} />
                    <p className={`text-xs font-medium ${
                      darkMode ? "text-green-300" : "text-green-700"
                    }`}>Global CDN</p>
                  </div>
                </div>
              </div>
            </div>
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
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
        .animation-delay-4000 {
          animation-delay: 4000ms;
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

export default Home;