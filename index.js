const express = require("express");
require("dotenv").config();
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./router/user_router");
const vocRouter = require("./router/data_router");
const irregularRouter = require("./router/irregularVerb");
const socket = require("./socket"); // Import socket.js
const phreseRouter=require("./router/phrese_router")

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:2000","https://voocabularybd.netlify.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create HTTP server
const server = http.createServer(app);

console.log("🟡 Socket.io initialization শুরু হচ্ছে...");

// Initialize Socket.io
socket.init(server); // This attaches socket.io to your server

console.log("✅ Socket.io initialization সম্পন্ন হয়েছে");

// Make socket functions available globally (optional)
app.set('socketio', socket.getIo());

// Routes
app.use("/api/users", userRouter);
app.use("/api/data", vocRouter);
app.use("/api/data", irregularRouter);
app.use("/api/phrese",phreseRouter);
app.use("/audio", express.static("audio"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ 
    success: false, 
    message: "Internal server error" 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: "Route not found" 
  });
});

// Database connection and server start
const PORT = process.env.PORT || 2000;
const MONGODB_URL = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URL)
  .then(() => {
    console.log("✅ Database connected successfully");
    
    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`🔌 Socket.io ready for real-time notifications`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  });