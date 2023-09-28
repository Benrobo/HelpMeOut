console.log("Content script is running.");
chrome.runtime.onMessage.addListener(function (msg, sender) {
  if (msg == "open_recorder") {
    console.log("MESSAGE RECEIVED");
    insertIframe();
  }
});

function insertIframe() {
  const iframe = document.createElement("iframe");
  const mainDiv = document.createElement("div");
  const url = chrome.runtime.getURL("index.html");
  mainDiv.setAttribute("class", "help-me-iframe show");
  iframe.setAttribute("allowtransparency", "true");
  iframe.width = window.innerWidth;
  iframe.height = window.innerHeight;
  iframe.src = url;
  iframe.style.zIndex = "9000000000000000000";

  mainDiv.append(iframe);
  document.body.appendChild(mainDiv);
}
