const express = require("express");
require("dotenv").config();

const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");

const userRouter = require("./router/user_router");
const vocRouter = require("./router/data_router");
const irregularRouter = require("./router/irregularVerb");
const phreseRouter = require("./router/phrese_router");
const googlerouter = require("./router/google_router");
const sitemapRouter = require("./router/sitemap_router");

const socket = require("./socket");

const app = express();

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:2002",
  "https://learnixdb.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin
      // Example: Postman, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS policy: Origin ${origin} is not allowed`)
      );
    },

    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);

// =====================================================
// BODY PARSER
// =====================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// HTTP SERVER
// =====================================================

const server = http.createServer(app);

// =====================================================
// SOCKET.IO
// =====================================================

const io = socket.init(server);

app.set("socketio", io);

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// =====================================================
// API ROUTES
// =====================================================

app.use("/api/users", userRouter);

app.use("/api/data", vocRouter);

app.use("/api/data", irregularRouter);

app.use("/api/phrese", phreseRouter);

app.use("/api/auth", googlerouter);

// =====================================================
// AUDIO FILES
// =====================================================

app.use("/audio", express.static("audio"));

// =====================================================
// SITEMAP
// =====================================================

app.use("/", sitemapRouter);

// =====================================================
// API 404 HANDLER
// =====================================================

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  // CORS error
  if (err.message && err.message.startsWith("CORS policy")) {
    return res.status(403).json({
      success: false,
      message: "CORS error",
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// =====================================================
// DATABASE + SERVER
// =====================================================

const PORT = process.env.PORT || 2000;

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  console.error("❌ MONGODB_URL is not defined in environment variables");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("✅ Database connected successfully");

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log("🔌 Socket.io ready");
      console.log("🌐 Backend API is ready");
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  });