const { convertWebMToAudio } = require("./helper/video");

(async () => {
  await convertWebMToAudio("./storage/qDhQXjN3V5.webm", "./storage/test.mp3");
})();
