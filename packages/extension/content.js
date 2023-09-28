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
  //   const embed = document.createElement("embed");
  const mainDiv = document.createElement("div");
  const url = chrome.runtime.getURL("index.html");

  mainDiv.setAttribute("class", "help-me-iframe-container hide");

  //   tried using embed and iframe, but they couldn't leave up to my requirements

  //   embed.setAttribute("class", "help-me-iframe-container hide");
  //   embed.setAttribute("allowtransparency", "true");
  //   embed.setAttribute("WMODE", "transparent");
  //   embed.width = window.innerWidth;
  //   embed.height = window.innerHeight;
  //   embed.src = url;
  //   embed.style.zIndex = "9000000000000000000";
  //   embed.style.backgroundColor = "transparency";

  fetch(url)
    .then((r) => r.text())
    .then((d) => {
      mainDiv.innerHTML = d;
      document.body.appendChild(mainDiv);
    });
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
