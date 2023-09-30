const ffmpeg = require("fluent-ffmpeg");
const openai = require("../config/openai");
const fs = require("fs");
const { createFile, deleteFile } = require("./file-manager");
const path = require("path");
const { sleep } = require(".");
const Video = require("../model/Video");

function convertWebMToAudio(input, output) {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .output(output)
      .on("end", () => {
        console.log("Conversion finished");
        resolve();
      })
      .on("error", (err) => {
        console.error("Error:", err.message);
        reject(err);
      })
      .run();
  });
}

async function transcribeAudio(filename, videoId, output) {
  try {
    const transcript = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filename),
      model: "whisper-1",
    });

    // update transcript in db
    const videoExists = await Video.findOne({
      uId: videoId,
    });

    if (videoExists) {
      const filter = { uId: videoId };
      const update = { transcript: transcript?.text };
      await Video.findOneAndUpdate(filter, update);

      console.log("Transcribing done.");

      // delete mp3 file
      deleteFile(output);
    } else {
      console.log("Failed updating transcript, Video dont exists.");
    }
  } catch (e) {
    console.log(`Error Transcribing Audio to Text: ${e.message}`);
  }
}

// this whole function should run in background
async function ProcessScreenRecordingVideos(fileName, videoId) {
  await sleep(1);
  const input = path.join(__dirname, "..", "storage", fileName);
  const output = path.join(__dirname, "..", "storage", `${videoId}.mp3`);

  if (!fs.existsSync(input)) {
    return console.log("Input file does not exist", { input });
  }
  await convertWebMToAudio(input, output);

  // create transcription of audio file
  await transcribeAudio(output, videoId, output);

  // delete webm file after use
  deleteFile(input);
}

module.exports = {
  convertWebMToAudio,
  transcribeAudio,
  ProcessScreenRecordingVideos,
};
