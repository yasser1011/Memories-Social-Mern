const express = require("express");
const router = express.Router();
require("dotenv").config();
const PostMessage = require("../models/PostMessage");
const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_APPID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "eu",
  useTLS: true,
});

router.get("/", async (req, res) => {
  const postMessages = await PostMessage.find().sort({ createdAt: "desc" });
  res.send(postMessages);
});

router.get("/:postId", async (req, res) => {
  // console.log(req.params.postId);
  const post = await PostMessage.findById(req.params.postId);
  if (!post) return res.status(404).send("no post with that id");
  res.send(post);
});

router.post("/", async (req, res) => {
  const post = req.body;

  const newPost = new PostMessage(post);
  // console.log(req.headers["x-socket-id"]);
  pusher.trigger(
    "my-channel",
    "notification",
    { msg: "hey" },
    { socket_id: req.headers["x-socket-id"] }
  );
  try {
    const savedPost = await newPost.save();
    await pusher.trigger("my-channel", "my-event", { id: savedPost._id });
    res.send(savedPost);
  } catch (error) {
    console.log(error);
    res.status(409).json({ message: error.message });
  }
});

router.patch("/like/:postId", async (req, res) => {
  //payload is true if it's like and false if it's dislike
  const { payload } = req.body;
  try {
    const post = await PostMessage.findById(req.params.postId);
    if (!post) return res.status(404).send("no post with that id");
    let updatedPost;
    if (payload) {
      updatedPost = await PostMessage.findByIdAndUpdate(
        req.params.postId,
        { likeCount: post.likeCount + 1 },
        { new: true }
      );
      //res.status(200).send(updatedPost.likeCount.toString());
    } else {
      updatedPost = await PostMessage.findByIdAndUpdate(
        req.params.postId,
        { likeCount: post.likeCount - 1 },
        { new: true }
      );
    }
    await pusher.trigger("my-channel", "like-event", {
      id: updatedPost._id,
      likeCount: updatedPost.likeCount,
    });
    res.status(200).send(updatedPost.likeCount.toString());
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
