// socket.js
let io;

module.exports = {
  init: (server) => {
    // ✅ LOG 1: Socket.io init ফাংশন কল হয়েছে
    console.log("🟡 socket.init() ফাংশন কল হয়েছে");
    
    const socketIO = require('socket.io');
    
    io = socketIO(server, {
      cors: {
        origin: ["http://localhost:5173", "http://localhost:3000","https://voocabularybd.netlify.app"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
      }
    });
    
    // ✅ LOG 2: Socket.io সফলভাবে তৈরি হয়েছে
    console.log("✅ Socket.io instance তৈরি হয়েছে");
    
    io.on('connection', (socket) => {
      // ✅ LOG 3: নতুন ক্লায়েন্ট কানেক্ট হলে
      console.log(`🟢 নতুন ক্লায়েন্ট সংযুক্ত হয়েছে: ${socket.id}`);
      console.log(`📊 মোট সংযুক্ত ক্লায়েন্ট: ${io.engine.clientsCount}`);
      
      socket.on('disconnect', () => {
        // ✅ LOG 4: ক্লায়েন্ট ডিসকানেক্ট হলে
        console.log(`🔴 ক্লায়েন্ট ডিসকানেক্ট হয়েছে: ${socket.id}`);
        console.log(`📊 বাকি ক্লায়েন্ট: ${io.engine.clientsCount}`);
      });
      
      socket.on('error', (error) => {
        // ✅ LOG 5: সকেটে error হলে
        console.error(`❌ Socket error from ${socket.id}:`, error);
      });
      
      // ✅ LOG 6: ক্লায়েন্ট থেকে মেসেজ এলে (optional)
      socket.on('any-event', (data) => {
        console.log(`📨 ক্লায়েন্ট থেকে মেসেজ পেয়েছি:`, data);
      });
    });
    
    return io;
  },
  
  getIo: () => {
    if (!io) {
      throw new Error('Socket.io initialized নয়! প্রথমে init কল করুন।');
    }
    return io;
  },
  
  emitNewWord: (wordData) => {
    // ✅ LOG 7: নোটিফিকেশন পাঠানোর চেষ্টা করলে
    console.log("📤 নোটিফিকেশন পাঠানোর চেষ্টা করছি...");
    console.log("📦 নোটিফিকেশন ডাটা:", wordData);
    
    if (io) {
      io.emit('new-word', wordData);
      // ✅ LOG 8: নোটিফিকেশন সফলভাবে পাঠানো হলে
      console.log(`✅ নোটিফিকেশন সফলভাবে পাঠানো হয়েছে: ${wordData.word || wordData.englishWord}`);
      console.log(`📢 ক্যাটাগরি: ${wordData.category}, সময়: ${new Date().toLocaleTimeString()}`);
    } else {
      // ✅ LOG 9: Socket.io initialized না থাকলে
      console.warn("⚠️ Socket.io initialized নয়, নোটিফিকেশন পাঠানো যায়নি");
    }
  }
};