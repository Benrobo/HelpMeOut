const express = require("express");
const {
  saveVideo,
  getVideoById,
  getAllVideos,
} = require("./service/saveVideo");
const multer = require("multer");

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

const router = express.Router();

router.post("/video/save", upload.single("videoFile"), saveVideo);
router.post("/video/:id", getVideoById);
router.post("/video/all", getAllVideos);

module.exports = router;
