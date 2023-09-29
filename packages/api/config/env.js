require("dotenv").config();

const ENV = {
  mongoUrl:
    process.env.NODE_ENV === "development"
      ? "mongodb://localhost:27017/helpmeout"
      : process.env.DATABASE_URL,
};

module.exports = ENV;
