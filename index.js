const express = require("express");
require("dotenv").config();
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path"); // ✅ path মডিউল যোগ করুন
const userRouter = require("./router/user_router");
const vocRouter = require("./router/data_router");
const irregularRouter = require("./router/irregularVerb");
const socket = require("./socket");
const phreseRouter = require("./router/phrese_router");
const googlerouter = require("./router/google_router");

const app = express();

// ✅ CORS Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:2002", "https://learnixdb.netlify.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ JSON Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create HTTP server
const server = http.createServer(app);

console.log("🟡 Socket.io initialization শুরু হচ্ছে...");

// Initialize Socket.io
const io = socket.init(server);
app.set("socketio", io);

console.log("✅ Socket.io initialization সম্পন্ন হয়েছে");

// =============================================
// ✅ API Routes (এর আগে static middleware বসাবেন না)
// =============================================
app.use("/api/users", userRouter);
app.use("/api/data", vocRouter);
app.use("/api/data", irregularRouter);
app.use("/api/phrese", phreseRouter);
app.use("/api/auth", googlerouter);
app.use("/audio", express.static("audio"));

// =============================================
// ✅ React Static Files Serve (API Routes এর পরে বসাতে হবে)
// =============================================

// 1️⃣ প্রথমে build ফোল্ডারের পাথ নির্ধারণ করুন
// যদি frontend/dist ফোল্ডার backend থেকে এক লেভেল উপরে থাকে
const frontendBuildPath = path.join(__dirname, "../frontend/dist");
// অথবা যদি build ফোল্ডার backend এর ভিতরে থাকে
// const frontendBuildPath = path.join(__dirname, "frontend/build");

console.log(`📁 Serving static files from: ${frontendBuildPath}`);

// 2️⃣ Static ফাইল সার্ভ করুন
app.use(express.static(frontendBuildPath));

// 3️⃣ সব রিকোয়েস্ট index.html-এ রিডাইরেক্ট করুন (React Router এর জন্য)
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: "API route not found" });
  }
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});
// =============================================
// ❌ আগের 404 handler সরিয়ে দিন (কারণ উপরের * handler সব ক্যাচ করবে)
// =============================================

// =============================================
// ✅ Error handling middleware (সবশেষে)
// =============================================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal server error"
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
      console.log(`📁 Serving React app from: ${frontendBuildPath}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  });