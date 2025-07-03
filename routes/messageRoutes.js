const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await Message.create({ name, email, message });
    res.status(200).json({ message: "OK" });
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;

