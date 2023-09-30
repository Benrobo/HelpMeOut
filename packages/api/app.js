const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./router");
const dbConnect = require("./config/mongodb");
const path = require("path");

// connect db
dbConnect();

// middlewares
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));

// serve media files from remote server
app.use(
  "/media/files",
  express.static(path.join(__dirname, "storage", "videos"))
);

app.use("/api", router);

app.use("*", (req, res) => {
  res.status(404).json({
    msg: "route not found",
  });
});

app.use((err, req, res) => {
  const errMsg = err?.response?.data?.message ?? err?.message;
  console.error(`Server error: ${errMsg}`);
  console.log(`Stack: ${err?.stack}`);
  res.status(400).json({
    message: errMsg,
    details: {
      stacks: process.env.NODE_ENV !== "production" && err?.stack,
    },
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
