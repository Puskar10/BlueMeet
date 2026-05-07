import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import Meeting from "./components/Meeting";

function App() {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");

  // Wrap the navigation logic in a separate component since useNavigate needs Router context
  return (
    <BrowserRouter>
      <AppContent 
        setJoined={setJoined}
        setRoomId={setRoomId}
        setUserName={setUserName}
        joined={joined}
        roomId={roomId}
        userName={userName}
      />
    </BrowserRouter>
  );
}

function AppContent({ setJoined, setRoomId, setUserName, joined, roomId, userName }) {
  const navigate = useNavigate();

  useEffect(() => {
    const storedRoomId = localStorage.getItem("roomId");
    const storedUserName = localStorage.getItem("userName");

    if (storedRoomId && storedUserName) {
      // Restore the state from localStorage
      setRoomId(storedRoomId);
      setUserName(storedUserName);
      setJoined(true);
      
      // Navigate to the room
      navigate(`/room/${storedRoomId}`);
    }
  }, [navigate, setRoomId, setUserName, setJoined]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            setJoined={setJoined}
            setRoomId={setRoomId}
            setUserName={setUserName}
          />
        }
      />

      <Route
        path="/room/:roomId"
        element={
          <Meeting
            roomId={roomId}
            userName={userName}
            joined={joined}
            setJoined={setJoined}
          />
        }
      />
    </Routes>
  );
}

export default App;