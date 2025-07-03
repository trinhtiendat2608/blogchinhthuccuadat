const Message = require('../models/Message');
exports.sendMessage = async (req, res) => {
  try {
    const newMsg = new Message(req.body);
    await newMsg.save();
    res.status(200).json({ success: true, message: "Message received!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};