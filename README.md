# 🔵 BlueMeet — Real-Time WebRTC Video Calling Platform

![GitHub stars](https://img.shields.io/github/stars/Puskar10/BlueMeet?style=social)
![GitHub forks](https://img.shields.io/github/forks/Puskar10/BlueMeet?style=social)
![Repo size](https://img.shields.io/github/repo-size/Puskar10/BlueMeet)
![License](https://img.shields.io/badge/license-MIT-blue)

BlueMeet is a **real-time peer-to-peer video conferencing web application** built using **WebRTC, React, and Socket.IO**.
It allows users to **create or join meeting rooms and start instant video calls directly in the browser** without installing plugins.

The project demonstrates **real-time communication architecture**, **WebRTC signaling**, and **peer-to-peer media streaming**, making it a strong portfolio-level project for developers interested in real-time systems.

---

# ✨ Features

* 📹 Real-time video calling using WebRTC
* 👥 Room-based meeting system
* ⚡ Peer-to-peer media streaming
* 🔌 WebSocket signaling with Socket.IO
* 🔒 Secure WebRTC encrypted connection
* 🎨 Clean and responsive UI
* 🌐 Cross-browser support

---

# 🏗 System Architecture

```
          +--------------------+
          |     React Client   |
          | (Camera + UI)      |
          +---------+----------+
                    |
                    | WebSocket
                    v
          +--------------------+
          |  Socket.IO Server  |
          |  (Signaling Layer) |
          +---------+----------+
                    |
                    | SDP / ICE
                    v
         +----------------------+
         |  WebRTC Peer Layer   |
         |  (Direct P2P Video)  |
         +----------------------+
```

---

# 🔄 WebRTC Connection Flow

```
User A              Server              User B
   |                   |                   |
   |--- Join Room ---->|                   |
   |                   |--- Notify ------->|
   |                   |                   |
   |---- Offer SDP ----------------------->|
   |<--- Answer SDP -----------------------|
   |                                       |
   |---- ICE Candidates ------------------>|
   |<--- ICE Candidates -------------------|
   |                                       |
   |========= Video Streaming ============|
```

---

# 🛠 Tech Stack

### Frontend

* React
* Vite
* TailwindCSS
* Framer Motion

### Backend

* Node.js
* Express
* Socket.IO

### Real-Time Communication

* WebRTC
* RTCPeerConnection
* MediaStream API
* ICE Candidate Exchange

---

# 📂 Project Structure

```
BlueMeet
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server
│   ├── socket
│   │   └── signaling.js
│   │
│   └── index.js
│
├── screenshots
│
└── README.md
```

---

# ⚙️ Installation

### 1. Clone the repository

```
git clone https://github.com/Puskar10/BlueMeet.git
```

### 2. Navigate to the project

```
cd BlueMeet
```

### 3. Install dependencies

Frontend:

```
cd client
npm install
```

Backend:

```
cd server
npm install
```

### 4. Run the application

Start backend server

```
npm run dev
```

Start frontend

```
npm run dev
```

---

# 📸 Screenshots

Add screenshots of the UI here.

```
/screenshots/home.png
/screenshots/video-call.png
```

Example:

```
![Home](screenshots/home.png)
![Video Call](screenshots/video-call.png)
```

---

# 🚀 Future Improvements

* 🖥 Screen sharing
* 💬 In-meeting chat system
* 👥 Multi-user group calls
* 📹 Meeting recording
* 🔐 Authentication system
* 🌍 TURN server support for global connectivity

---

# 🌐 Deployment

Frontend can be deployed on:

* Vercel
* Netlify

Backend can be deployed on:

* Render
* Railway
* AWS

---

# 👨‍💻 Author

**Puskar Shaw**

GitHub
https://github.com/Puskar10

---

# 🤝 Contributing

1. Fork the repository
2. Create a feature branch

```
git checkout -b feature/new-feature
```

3. Commit your changes

```
git commit -m "Add new feature"
```

4. Push to your branch

```
git push origin feature/new-feature
```

5. Open a Pull Request

---

# ⭐ Support

If you like this project, please consider giving it a **star ⭐ on GitHub**.

---

# 📜 License

This project is licensed under the **MIT License**.

