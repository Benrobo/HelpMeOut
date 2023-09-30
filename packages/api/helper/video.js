const ffmpeg = require("fluent-ffmpeg");
const openai = require("../config/openai");
const fs = require("fs");

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

async function transcribeAudio(filename) {
  try {
    const transcript = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filename),
      model: "whisper-1",
    });
    return transcript;
  } catch (e) {
    console.log(`Error Transcribing Audio to Text: ${e.message}`);
  }
}

module.exports = {
  convertWebMToAudio,
  transcribeAudio,
};
