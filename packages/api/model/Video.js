const mongoose = require("mongoose");

const videoSchema = mongoose.Schema({
  vId: { type: String, required: true },
  transcript: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
