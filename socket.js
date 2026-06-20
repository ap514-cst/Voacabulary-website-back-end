const socketIO = require("socket.io");

let io;

module.exports = {
  init: (server) => {
    console.log("🟡 socket.init() ফাংশন কল হয়েছে");

    io = new socketIO.Server(server, {
      cors: {
        origin: [
          "https://voocabularybd.netlify.app",
          "http://localhost:5173"
        ],
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ["websocket", "polling"] // ⭐ IMPORTANT FIX
    });

    console.log("✅ Socket.io instance তৈরি হয়েছে");

    io.on("connection", (socket) => {
      console.log("🟢 Client connected:", socket.id);
    });

    return io;
  },

  getIo: () => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
  },

  emitNewWord: (wordData) => {
    if (io) {
      io.emit("new-word", wordData);
      console.log("📤 emitted new-word");
    }
  }
};