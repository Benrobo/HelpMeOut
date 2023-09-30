const ffmpeg = require("fluent-ffmpeg");
const openai = require("../config/openai");
const fs = require("fs");
const { createFile, deleteFile } = require("./file-manager");
const path = require("path");
const { sleep } = require(".");
const Video = require("../model/Video");

function convertMp4ToAudio(input, output) {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .output(output)
      .on("end", () => {
        console.log("Conversion finished");
        resolve();
      })
      .on("error", (err) => {
        console.error("Error converting to audio:", err.message);
        reject(err);
      })
      .run();
  });
}

function convertWebMToMp4(input, output) {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .output(output)
      .on("end", () => {
        // delete .webm file
        deleteFile(input);
        console.log("Conversion to Mp4 finished");
        resolve({ error: false });
      })
      .on("error", (err) => {
        console.error("Error converting to video:", err.message);
        reject({ error: true });
      })
      .run();
  });
}

function generateThumbnail(videoId, folderPath, videoPath) {
  const imageName = `${videoId}.png`;
  // console.log({ videoId, imageName, folderPath, videoPath });
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        timestamps: ["50%"], // Capture a screenshot at the middle of the video
        filename: imageName,
        folder: folderPath,
      })
      .on("end", async () => {
        try {
          await Video.findOneAndUpdate(
            { vId: videoId },
            { thumbnail: `${folderPath}/${imageName}` }
          );
          console.log("Thumbnail updated");
        } catch (e) {
          console.log("");
          console.log("Failed to update thumbnail in DB");
          console.log("");
        }
        console.log("Screenshots captured successfully.");
      })
      .on("error", (err) => {
        console.error("Error capturing screenshots:", err);
      });
  });
}

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
      const filter = { uId: videoId };
      const update = { transcript: transcript?.text };
      await Video.findOneAndUpdate(filter, update);

      console.log("Transcribing done. \n");

      // delete mp3 file
      deleteFile(audioOutput);
    } else {
      console.log("Failed updating transcript, Video dont exists.");
      deleteFile(audioOutput);
    }
  } catch (e) {
    console.log(`Error Transcribing Audio to Text: ${e}`);
    deleteFile(audioOutput);
  }
}

// this whole function should run in background
async function ProcessScreenRecordingVideos(videoId) {
  await sleep(1);
  const input = path.join(__dirname, "..", "storage/videos", `${videoId}.webm`);
  const output = path.join(__dirname, "..", "storage/videos", `${videoId}.mp4`);
  const audioOutput = path.join(
    __dirname,
    "..",
    "storage/audios",
    `${videoId}.mp3`
  );
  const thumnnailPath = path.join(
    __dirname,
    "..",
    "storage",
    "thumbnails",
    `${videoId}.png`
  );
  const thumnailFolder = path.join(__dirname, "..", "storage", "thumbnails");

  if (!fs.existsSync(input)) {
    console.log("Input file does not exist", { input });
    return;
  }
  // convert webm to mp4
  const finishedConvertion = await convertWebMToMp4(input, output);
  if (!finishedConvertion?.error) {
    const newMp4Path = path.join(
      __dirname,
      "..",
      "storage",
      "videos",
      `${videoId}.mp4`
    );
    await convertMp4ToAudio(newMp4Path, audioOutput);

    // generate thumbnail image
    if (!fs.existsSync(thumnnailPath)) {
      await generateThumbnail(videoId, thumnailFolder, newMp4Path);
    }

    // generate transcript
    await transcribeAudio(audioOutput, videoId);
  } else {
    console.log(`Error converting webm to mp4`);
  }
}

async function handleIncomingStream(videoPath) {}

module.exports = {
  convertMp4ToAudio,
  transcribeAudio,
  ProcessScreenRecordingVideos,
  generateThumbnail,
  convertWebMToMp4,
};
