// background.js
chrome.action.onClicked.addListener(function (tab) {
  try {
    const { host } = new URL(tab.url);
    if (host === "extension") return;

    chrome.tabCapture.getMediaStreamId(
      {
        consumerTabId: tab.id,
      },
      (streamId) => {
        chrome.tabs.sendMessage(tab.id, {
          msg: "open_recorder",
          tab,
          streamId,
        });
      }
    );
    console.log("MESSAGE SENT");
  } catch (e) {
    console.log("ERROR PARSING TAB URL");
  }
});

// run this script in background
chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    if (tab.url?.startsWith("chrome://")) return undefined;

    // execute content script
    executeScript(activeInfo?.tabId);
  });
});

// execute content.js file on tab change.
function executeScript(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ["content.js"],
  });
}
