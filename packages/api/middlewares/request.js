function requestEvent(req, res, next) {
  req
    .on("data", (data) => {
      console.log("INCOMONG DATA", data);
    })
    .on("end", () => {
      console.log("STREAM END");
    });
  next();
}

module.exports = requestEvent;
