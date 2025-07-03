const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ✅ Đã thay mật khẩu MongoDB thành "Trinhdat.2608"
const MONGO_URI = 'mongodb+srv://dathmuk117:Trinhdat.2608@cluster0.aaixf2i.mongodb.net/chatApp?retryWrites=true&w=majority&appName=Cluster0';

// ✅ Mô hình tin nhắn
const messageSchema = new mongoose.Schema({
  name: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

// ✅ Kết nối MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connect error:', err);
});

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Socket.IO: nhận và gửi tin nhắn
io.on('connection', (socket) => {
  console.log('🟢 Client connected:', socket.id);

  // Gửi tất cả tin nhắn cũ
  Message.find().sort({ createdAt: 1 }).then(messages => {
    socket.emit('load messages', messages);
  });

  // Nhận tin nhắn mới từ client
  socket.on('chat message', async (msg) => {
    try {
      if (!msg.name || !msg.content) return;
      const saved = await new Message(msg).save();
      io.emit('chat message', saved); // Gửi lại cho tất cả client
    } catch (err) {
      console.error('❌ Lỗi khi lưu tin nhắn:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

// ✅ Kiểm tra server
app.get('/ping', (req, res) => {
  res.send('✅ Server OK');
});

// ✅ Khởi động server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
