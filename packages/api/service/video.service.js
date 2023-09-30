const { createFile, deleteFile } = require("../helper/file-manager");
const { convertWebMToAudio, transcribeAudio } = require("../helper/video");
const Video = require("../model/Video");
const shortId = require("short-uuid");

async function saveVideo(req, res) {
  try {
    const audiobuffer = req?.files["audioFile"][0]?.buffer;
    const videobuffer = req?.files["videoFile"][0]?.buffer;
    if (
      typeof audiobuffer === "undefined" ||
      typeof videobuffer === "undefined"
    ) {
      res.status(400).json({ message: "Media buffer is missing." });
      return;
    }

    const videoId = shortId.generate().slice(0, 10);

    // await Video.create({
    //   uId: videoId,
    //   videoData: videobuffer,
    //   audioData: audiobuffer,
    // });

    const fileName = `${videoId}.webm`;
    const fileDir = process.cwd() + "/storage";
    const fileCreated = createFile(fileDir, fileName, audiobuffer);

    // convert to audio file
    if (fileCreated) {
      const input = `./storage/${fileName}`;
      const output = `./storage/${videoId}.mp3`;
      await convertWebMToAudio(input, output);

      // delete webm file after use
      deleteFile(input);

      // create transcription of audio file
      const transcribed = await transcribeAudio(output);

      console.log(transcribed);
      res.status(200).json({ message: "Video saved successfully" });
    }
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
