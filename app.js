const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// 🔐 MongoDB URI chuẩn
const mongoURI = "mongodb+srv://dathmuk117:Trinhtiendat.2608@cluster0.aaixf2i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// ⚙️ Middleware
app.use(cors());
app.use(express.json());

// 📁 Dẫn tới folder chứa web
app.use(express.static(path.join(__dirname, "client")));

// 🌐 MongoDB Connect
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// 📦 Routes
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));

// ⚡ WebSocket Chat
const ChatMessage = require("./models/message");
io.on("connection", socket => {
  ChatMessage.find().sort({ createdAt: 1 }).then(messages => {
    socket.emit("load messages", messages.map(m => ({ name: m.name, content: m.message })));
  });

  socket.on("chat message", async data => {
    const newMsg = new ChatMessage({
      name: data.name,
      message: data.content
    });
    await newMsg.save();
    io.emit("chat message", data);
  });
});

// 🌍 Server chạy
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
