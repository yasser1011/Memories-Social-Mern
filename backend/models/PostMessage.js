const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String },
  creator: { type: String },
  tags: [{ type: String }],
  selectedFile: String,
  likeCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: new Date() },
});

module.exports = mongoose.model("posts", postSchema);
