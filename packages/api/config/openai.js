const OpenAI = require("openai");
const ENV = require("./env");

const openai = new OpenAI({
  apiKey: ENV.openaiKey,
});

module.exports = openai;
