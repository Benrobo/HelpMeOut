const axios = require("axios");

// axios config for server
const $http = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: true,
});

module.exports = $http;
