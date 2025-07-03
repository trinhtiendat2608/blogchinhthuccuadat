const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Tạo bài viết
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = new Post({ title, content });
    await newPost.save();
    res.status(201).json({ message: "Đăng bài thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Lấy danh sách bài viết
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
