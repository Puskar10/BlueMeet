import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Meeting from "./components/Meeting";

function App() {
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;