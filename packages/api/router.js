const express = require("express");
const {
  saveVideo,
  getVideoById,
  getAllVideos,
} = require("./service/video.service");
const multer = require("multer");

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

const router = express.Router();

router.post(
  "/video/save",
  upload.fields([{ name: "videoFile" }, { name: "audioFile" }]),
  saveVideo
);
router.post("/video/:id", getVideoById);
router.post("/video/all", getAllVideos);

module.exports = router;
