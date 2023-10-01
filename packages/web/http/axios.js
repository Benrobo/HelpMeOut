const axios = require("axios");
const { default: ENV } = require("../config/env");

// axios config for server
const $http = axios.create({
  baseURL: ENV.apiUrl,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: true,
});

module.exports = $http;
