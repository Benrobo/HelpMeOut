const mongoose = require("mongoose");

const videoSchema = mongoose.Schema({
  uId: { type: String, required: true },
  videoData: { type: Buffer, required: true },
  audioData: { type: Buffer, required: true },
  transcript: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
