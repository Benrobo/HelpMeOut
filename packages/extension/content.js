console.log("Content script is running.");
chrome.runtime.onMessage.addListener(function (msg, sender) {
  if (msg == "open_recorder") {
    console.log("MESSAGE RECEIVED");
    toggleScreenRecord();
  }
});

var $ = (elm) => document.querySelector(elm);
var $all = (elm) => document.querySelectorAll(elm);

window.addEventListener("DOMContentLoaded", () => {
  insertIframe();
});

function insertIframe() {
  const mainDiv = document.createElement("div");
  const url = chrome.runtime.getURL("index.html");

  mainDiv.setAttribute("class", "help-me-iframe-container hide");

  //   tried using embed and iframe, but they couldn't leave up to my requirements
  fetch(url)
    .then((r) => r.text())
    .then((data) => {
      const updatedData = data.replace(
        "__MSG_@@extension_id__",
        chrome.runtime.id
      );
      mainDiv.innerHTML = updatedData;
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
