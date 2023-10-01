const openai = require("../config/openai");
const fs = require("fs");
const { createFile, deleteFile } = require("./file-manager");
const path = require("path");
const { sleep } = require(".");
const Video = require("../model/Video");

async function transcribeAudio(audioOutput, videoId) {
  try {
    if (!fs.existsSync(audioOutput)) {
      console.log(`Audio output ${audioOutput} notfound`);
      return;
    }
    const transcript = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioOutput),
      model: "whisper-1",
    });

    // update transcript in db
    const videoExists = await Video.findOne({
      vId: videoId,
    });

    if (videoExists) {
      const filter = { vId: videoId };
      const update = { transcript: transcript?.text };
      await Video.findOneAndUpdate(filter, update);

      console.log("Transcribing done. \n");
    } else {
      console.log("Failed updating transcript, Video dont exists.");
    }
  } catch (e) {
    console.log(`Error Transcribing Audio to Text: ${e}`);
  }
}

// this whole function should run in background
async function ProcessScreenRecordingVideos(videoId) {
  const input = path.join(__dirname, "..", "storage/videos", `${videoId}.webm`);

  if (!fs.existsSync(input)) {
    console.log("Input file does not exist", { input });
    return;
  }
  // generate transcript
  await transcribeAudio(input, videoId);
}

module.exports = {
  transcribeAudio,
  ProcessScreenRecordingVideos,
};
