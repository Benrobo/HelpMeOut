require("dotenv").config();

const ENV = {
  mongoUrl:
    process.env.NODE_ENV === "development"
      ? "mongodb://localhost:27017/helpmeout"
      : process.env.DATABASE_URL,
  agendaMongoUrl:
    process.env.NODE_ENV === "development"
      ? "mongodb://localhost:27017/agenda"
      : process.env.AGENDA_DATABASE_URL,
  openaiKey: process.env.OPENAI_KEY,
};

module.exports = ENV;
