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

  setTimeout(() => {
    var container = document.querySelector(".help-me-container");
    var element = document.querySelector(".help-me-bubble-control");
    // initialize drag
    new Draggable(element, container);
  }, 2000);
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

function Draggable(draggableElement, container) {
  let isDragging = false;
  let offsetX, offsetY;

  draggableElement.addEventListener("mousedown", (e) => {
    isDragging = true;
    const rect = draggableElement.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    draggableElement.style.zIndex = "1";
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      const containerRect = container.getBoundingClientRect();
      const maxX = containerRect.width - draggableElement.offsetWidth;
      const maxY = containerRect.height - draggableElement.offsetHeight;

      let x = e.clientX - offsetX - containerRect.left;
      let y = e.clientY - offsetY - containerRect.top;

      // Check boundaries
      x = Math.max(0, Math.min(x, maxX));
      y = Math.max(0, Math.min(y, maxY));

      draggableElement.style.left = x + "px";
      draggableElement.style.top = y + "px";
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    draggableElement.style.zIndex = "0";
  });
}
