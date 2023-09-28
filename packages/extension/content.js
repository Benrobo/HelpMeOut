console.log("Content script is running.");
chrome.runtime.onMessage.addListener(function (msg, sender) {
  if (msg == "open_recorder") {
    console.log("MESSAGE RECEIVED");
    insertIframe();
  }
});

function insertIframe() {
  const iframe = document.createElement("iframe");
  const url = chrome.runtime.getURL("index.html");
  iframe.setAttribute("class", "help-me-iframe visible");
  iframe.src = url;
  iframe.style.position = "fixed";
  iframe.style.top = "0px";
  iframe.style.right = "0px";
  iframe.style.zIndex = "9000000000000000000";
  //   document.body.appendChild(iframe);
}
