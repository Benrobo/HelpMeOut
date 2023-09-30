const { Agenda } = require("@hokify/agenda");
const ENV = require("../config/env");
const { ProcessScreenRecordingVideos } = require("../helper/video");

const agenda = new Agenda({
  db: {
    address: ENV.agendaMongoUrl,
  },
});

agenda.define(
  "process_video",
  async (job, done) => {
    try {
      const { videoId } = job.attrs.data;
      await ProcessScreenRecordingVideos(videoId);
      done();
    } catch (e) {
      console.log(e);
      console.log(`Error processing recorded video. ${e.message}`);
      done();
    }
  },
  { concurrency: 10, priority: "high" }
);

async function processVideos(videoId) {
  agenda.start();
  await agenda.now("process_video", {
    videoId,
  });
  // agenda.start();
  console.log("");
  console.log("VIDEO PROCESSING IN BG. \n");
}

agenda.on("start", (job) => {
  console.log("Job %s starting", job.attrs.name);
});

module.exports = {
  processVideos,
};
