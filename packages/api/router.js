const express = require("express");
const {
  getVideoById,
  getAllVideos,
  streamVideoBytes,
  endStream,
} = require("./service/video.service");
const multer = require("multer");
const requestEvent = require("./middlewares/request");

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

const router = express.Router();

router.post(
  "/video/stream",
  upload.fields([{ name: "blob" }, { name: "videoId" }]),
  streamVideoBytes
);
router.get("/stream/end/:videoId", endStream);
router.get("/video/get/:id", getVideoById);
router.get("/videos", getAllVideos);

module.exports = router;
