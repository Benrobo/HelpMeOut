const Video = require("../model/Video");
const shortId = require("short-uuid");

async function saveVideo(req, res) {
  try {
    const buffer = req?.file?.buffer;
    if (typeof buffer === "undefined") {
      res.status(400).json({ message: "Video buffer is missing." });
      return;
    }

    await Video.create({
      uId: shortId.generate(),
      data: buffer,
    });

    res.status(200).json({ message: "Video saved successfully" });
  } catch (e) {
    console.log(`Error saving video: ${e.message}`);
    res.status(500).json({ message: "Something went wrong." });
  }
}

async function getVideoById(req, res) {
  try {
    const videoId = req.params["id"];
    if (typeof videoId === "undefined") {
      res.status(404).json({ message: "Video video id is missing." });
      return;
    }

    // check if video exists
    const videoExists = await Video.findOne({
      uId: videoId,
    });

    if (!videoExists) {
      return res.status(404).json({ message: "Video not found." });
    }

    res
      .status(200)
      .json({ message: "Video fetched successfully", data: videoExists });
  } catch (e) {
    console.log(`Error fetching video: ${e.message}`);
    res.status(500).json({ message: "Something went wrong" });
  }
}

async function getAllVideos(req, res) {
  try {
    // check if video exists
    const allVideos = await Video.find();

    res
      .status(200)
      .json({ message: "Video fetched successfully", data: allVideos });
  } catch (e) {
    console.log(`Error fetching all video: ${e.message}`);
    res.status(500).json({ message: "Something went wrong" });
  }
}

module.exports = {
  saveVideo,
  getVideoById,
  getAllVideos,
};
