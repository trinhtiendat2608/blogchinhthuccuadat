const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

router.post("/", async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    await newComment.save();
    res.status(200).json("Comment added");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
