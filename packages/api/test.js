const {
  convertMp4ToAudio,
  generateThumbnail,
  convertWebMToMp4,
} = require("./helper/video");

// 0923
(async () => {
  // await convertWebMToAudio("./storage/qDhQXjN3V5.webm", "./storage/test.mp3");
  await generateThumbnail(
    "dVO4WFKVg7",
    "./storage/thumbnails",
    "./storage/videos/dVO4WFKVg7.mp4"
  );
  // await convertMp4ToAudio(
  //   "./storage/videos/KhASg4N0eg.webm",
  //   "./storage/videos/KhASg4N0eg.mp4"
  // );
})();
