const { createFile, deleteFile } = require("../helper/file-manager");
const Video = require("../model/Video");
const shortId = require("short-uuid");
const { processVideos } = require("../process/agenda");
const fs = require("fs");
const path = require("path");

async function saveVideo(req, res) {
  try {
    const blobBuffer = req?.files["blob"][0]?.buffer;
    const videoId = req?.body?.videoId;
    if (typeof blobBuffer === "undefined" || typeof videoId === "undefined") {
      res.status(400).json({ message: "Media payload is missing." });
      return;
    }

    await Video.create({
      uId: videoId,
    });

    const fileName = `${videoId}.webm`;
    const fileDir = process.cwd() + "/storage";

    // create file
    const fileCreated = createFile(fileDir, fileName, blobBuffer);
    if (fileCreated) {
      // background job
      await processVideos(fileName, videoId);
    }

    res.status(200).json({ message: "Video processing in background." });
  } catch (e) {
    console.log(`Error saving video: ${e.message}`);
    res.status(500).json({ message: "Something went wrong." });
  }
}

async function streamVideoBytes(req, res) {
  try {
    const blobBuffer = req?.files["blob"][0]?.buffer;
    const videoId = req?.body?.videoId;
    if (typeof blobBuffer === "undefined" || typeof videoId === "undefined") {
      console.log(`Stream media payload is missing.`);
      res.status(400).json({ message: "Media payload is missing." });
      return;
    }

    const videoExists = await Video.findOne({ vId: videoId });
    if (!videoExists) {
      await Video.create({
        vId: videoId,
      });
    }

    const fileName = `${videoId}.webm`;
    const fileDir = process.cwd() + "/storage/videos";
    const videoPath = `${fileDir}/${fileName}`;

    // create file
    if (!fs.existsSync(videoPath)) {
      createFile(fileDir, fileName, "");
    }
    const videoStream = fs.createWriteStream(videoPath);
    videoStream.write(blobBuffer);
    console.info(`Streaming chunks...`);

    res.status(200).json({ message: "Video processing in background." });
  } catch (e) {
    console.log(`Error saving video: ${e.message}`);
    res.status(500).json({ message: "Something went wrong." });
  }
}

async function endStream(req, res) {
  try {
    const videoId = req.params["videoId"];
    if (typeof videoId === "undefined") {
      return res.status(400).json({ message: "expected recorded video id" });
    }

    // check if videoId exists
    const video = await Video.findOne({ vId: videoId });

    if (video === null) {
      res
        .status(404)
        .json({ message: "Failed to end stream, media not found." });
      return;
    }

    const fileName = `${videoId}.webm`;
    const fileDir = process.cwd() + "/storage/videos";
    const videoPath = `${fileDir}/${fileName}`;

    // create file
    if (!fs.existsSync(videoPath)) {
      createFile(fileDir, fileName, "");
    }

    // call the background job
    await processVideos(videoId);

    res.status(200).json({ message: "Stream ended" });
    console.log("");
    console.log("Stream ended \n");
  } catch (e) {
    console.log(`Something went wrong ending stream: ${e.message}`);
    res.status(500).json({ message: "Something went wrong." });
  }
}

async function getVideoById(req, res) {
  try {
    const videoId = req.params["id"];
    if (typeof videoId === "undefined") {
      res.status(404).json({ message: "Video id is missing." });
      return;
    }

    // check if video exists
    const videoExists = await Video.findOne({
      vId: videoId,
    });

    if (!videoExists) {
      return res.status(404).json({ message: "Video not found." });
    }

    const videoPath = path.join(
      __dirname,
      "..",
      "storage",
      "videos",
      `${videoId}.mp4`
    );
    const videoWebmPath = path.join(
      __dirname,
      "..",
      "storage",
      "videos",
      `${videoId}.webm`
    );
    const audioPath = path.join(
      __dirname,
      "..",
      "storage",
      "audios",
      `${videoId}.mp3`
    );

    const thumbnailPath = path.join(
      __dirname,
      "..",
      "storage",
      "thumbnails",
      `${videoId}.png`
    );

    // check if this video exist on server
    if (!fs.existsSync(videoPath)) {
      res.status(404).json({ message: "Video no longer exists on server" });

      // delete from DB
      await Video.deleteOne({ vId: videoId });
      // delete the video, audio and thumbnail
      deleteFile(videoPath);
      deleteFile(videoWebmPath);
      deleteFile(audioPath);
      deleteFile(thumbnailPath);
      return;
    }

    res.status(200).json({
      message: "Video fetched successfully",
      data: {
        id: videoExists.vId,
        videoPath,
        transcript: videoExists.transcript,
        createAt: videoExists.createdAt,
        thumbnail: videoExists.thumbnail,
      },
    });
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
  streamVideoBytes,
  endStream,
};
