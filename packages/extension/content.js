console.log("Content script is running.");
chrome.runtime.onMessage.addListener(function (msg, sender) {
  if (msg == "open_recorder") {
    console.log("MESSAGE RECEIVED");
    toggleScreenRecord();
  }
});

const $ = (elm) => document.querySelector(elm);
const $all = (elm) => document.querySelectorAll(elm);

window.addEventListener("DOMContentLoaded", () => {
  insertIframe();
});

function insertIframe() {
  const iframe = document.createElement("iframe");
  const mainDiv = document.createElement("div");
  const url = chrome.runtime.getURL("index.html");

  mainDiv.setAttribute("class", "help-me-iframe-container hide");
  iframe.setAttribute("allowtransparency", "true");
  iframe.width = window.innerWidth;
  iframe.height = window.innerHeight;
  iframe.src = url;
  iframe.style.zIndex = "9000000000000000000";

  mainDiv.append(iframe);
  document.body.appendChild(mainDiv);
}

function toggleScreenRecord() {
  const mainDiv = $(".help-me-iframe-container");
  if (mainDiv.classList.contains("show")) {
    mainDiv.classList.remove("show");
    mainDiv.classList.add("hide");
  } else {
    mainDiv.classList.remove("hide");
    mainDiv.classList.add("show");
  }
}
