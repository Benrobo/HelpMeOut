const { Agenda } = require("@hokify/agenda");
const ENV = require("../config/env");
const { ProcessScreenRecordingVideos } = require("../helper/video");

const agenda = new Agenda({
  db: {
    address: ENV.agendaMongoUrl,
  },
});

agenda.define("process_video", async (job, done) => {
  try {
    const { fileName, videoId } = job.attrs.data;
    await ProcessScreenRecordingVideos(fileName, videoId);
    done();
  } catch (e) {
    console.log(e);
    console.log(`Error processing recorded video. ${e.message}`);
    done();
  }
});

async function processVideos(fileName, videoId) {
  agenda.start();
  await agenda.now("process_video", {
    fileName,
    videoId,
  });
  console.log("VIDEO PROCESSING IN BG.");
}

agenda.on("start", (job) => {
  console.log("Job %s starting", job.attrs.name);
});

module.exports = {
  processVideos,
};
