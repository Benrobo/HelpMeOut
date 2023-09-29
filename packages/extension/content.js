chrome.runtime.onMessage.addListener(function (msg, sender) {
  if (msg == "open_recorder") {
    console.log("MESSAGE RECEIVED");
    toggleScreenRecord();
  }
});

// var is been used rather than let, bcos
// once the script get excuted on tab change
// redeclaration of variables error occurs.

var $ = (elm) => document.querySelector(elm);
var $all = (elm) => document.querySelectorAll(elm);
var sleep = (time = 1) => new Promise((res) => setTimeout(res, time * 1000));

window.addEventListener("DOMContentLoaded", async () => {
  insertIframe();

  // wait 2sec before continuing
  await sleep(2);

  // Draggable
  var container = $("body");
  var dragElement = $(".help-me-bubble-user-img");
  var dragBubble = $(".help-me-bubble-main-controls");
  var affectedElement = $(".help-me-bubble-control");
  // initialize drag
  new Draggable(dragElement, affectedElement, container);
  new Draggable(dragBubble, affectedElement, container);

  //   backend api url
  var API_BASE_URL = `http://localhost:8080/api`;

  // recording components
  var HMOContainer = $(".help-me-iframe-container");
  var HMORecorderComp = $(".help-me-record-comp");
  var HMORecorderBubbComp = $(".help-me-bubble-control");
  var HMOCloseBtn = $(".help-me-close-btn");
  var HMOCameraSwitch = $(".help-me-camera-switch");
  var HMOAudioSwitch = $(".help-me-audio-switch");
  var HMOStartRecordingBtn = $(".help-me-start-record-btn");

  // preview video element
  var HMOPreviewVideoContainer = $(".hmo-preview-video");
  var HMOPreviewVideo = $(".hmo-preview-video-tag");
  var HMOSaveVideo = $(".hmo-save-video");
  var HMOCancelVideo = $(".hmo-cancel-video");

  // bubbe controls
  var HMOBubbUserImg = $(".hmo-avatar-img");
  var HMOBubbUserVideo = $(".hmo-user-video");
  var HMOBubbCounter = $(".hmo-bubble-counter-txt");
  var HMOBubbCounterAnim = $(".hmo-animate-pulse");

  // media controls
  var HMOBubbMediaControls = $all(".bubble-media-control");
  var stopBtn = Array.from(HMOBubbMediaControls).filter((btn) => {
    return btn.name === "stop";
  })[0];
  var pauseBtn = Array.from(HMOBubbMediaControls).filter((btn) => {
    return btn.name === "pause";
  })[0];
  var playBtn = Array.from(HMOBubbMediaControls).filter((btn) => {
    return btn.name === "play";
  })[0];
  var audioBtn = Array.from(HMOBubbMediaControls).filter((btn) => {
    return btn.name === "audio";
  })[0];
  var cameraBtn = Array.from(HMOBubbMediaControls).filter((btn) => {
    return btn.name === "camera";
  })[0];

  // GLOBAL VARIABLES
  var cameraState =
    JSON.parse(localStorage.getItem("@hmo_use_camera")) ?? false;
  var audioState = JSON.parse(localStorage.getItem("@hmo_use_audio")) ?? false;
  var startedRecording = false;

  // Countdown Timer
  var countMin = 0;
  var countSec = 0;
  var countHr = 0;
  var isTimerPaused = false;
  var timerInterval;
  var shouldRestart = false;
  var counter = bubbleCounter();

  // recorder data
  var recordedChunks = [];
  var recordedBlobUrl = "";
  var mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
    ? "video/webm; codecs=vp9"
    : "video/webm";
  var mediaRecorder = null;
  var mediaTracks = null;

  // bubble counter
  timerInterval = setInterval(() => {
    if (isTimerPaused || !startedRecording) return;
    countSec += 1;
    if (countSec === 60) {
      countMin += 1;
      countSec = 0;
    }
    if (countMin === 60) {
      countHr += 1;
      countSec = 0;
    }
    updateCounterCont(countHr, countMin, countSec);
  }, 1000);

  // media icons
  var playIcon = `
<svg width="128" height="128" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" class="icon">
    <path fill="" d="M240 128a15.74 15.74 0 0 1-7.6 13.51L88.32 229.65a16 16 0 0 1-16.2.3A15.86 15.86 0 0 1 64 216.13V39.87a15.86 15.86 0 0 1 8.12-13.82a16 16 0 0 1 16.2.3l144.08 88.14A15.74 15.74 0 0 1 240 128Z"/>
</svg>
`;
  var cameraOffIcon = `
<svg width="512" height="512" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="icon">
    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
        <path d="m3 3l18 18m-6-10v-1l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-.675.946"/>
        <path d="M10 6h3a2 2 0 0 1 2 2v3m0 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1"/>
    </g>
</svg>
`;
  var audioOffIcon = `
<svg width="128" height="128" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="icon">
    <path fill="" d="M10.8 4.9c0-.66.54-1.2 1.2-1.2s1.2.54 1.2 1.2l-.01 3.91L15 10.6V5c0-1.66-1.34-3-3-3c-1.54 0-2.79 1.16-2.96 2.65l1.76 1.76V4.9zM19 11h-1.7c0 .58-.1 1.13-.27 1.64l1.27 1.27c.44-.88.7-1.87.7-2.91zM4.41 2.86L3 4.27l6 6V11c0 1.66 1.34 3 3 3c.23 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52c-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28a7.13 7.13 0 0 0 2.55-.9l4.2 4.2l1.41-1.41L4.41 2.86z"/>
</svg>
`;
  var audioOnIcon = `
<svg
    width="128"
    height="128"
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    class="icon"
    >
    <path
        fill="none"
        stroke="#000000"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
        d="M192 448h128m64-240v32c0 70.4-57.6 128-128 128h0c-70.4 0-128-57.6-128-128v-32m128 160v80"
    />
    <path
        fill="none"
        stroke="#000000"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
        d="M256 64a63.68 63.68 0 0 0-64 64v111c0 35.2 29 65 64 65s64-29 64-65V128c0-36-28-64-64-64Z"
    />
    </svg>
`;
  var cameraOnIcon = `
  <svg
    width="128"
    height="128"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    class="icon"
    >
    <path
        fill=""
        d="M21.53 7.15a1 1 0 0 0-1 0L17 8.89A3 3 0 0 0 14 6H5a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h9a3 3 0 0 0 3-2.89l3.56 1.78A1 1 0 0 0 21 17a1 1 0 0 0 .53-.15A1 1 0 0 0 22 16V8a1 1 0 0 0-.47-.85ZM15 15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1Zm5-.62l-3-1.5v-1.76l3-1.5Z"
    />
    </svg>
`;

  // update audio and camera switch input checked state
  HMOCameraSwitch.toggleAttribute("checked", !!cameraState);
  HMOAudioSwitch.toggleAttribute("checked", !!audioState);
  cameraState ? showCam() : hideCam();

  // handle camera and audio toggle states
  HMOCameraSwitch.addEventListener("change", (e) => {
    localStorage.setItem("@hmo_use_camera", e.target.checked);
    cameraState = e.target.checked;
    cameraBtn.innerHTML = e.target.checked ? cameraOnIcon : cameraOffIcon;
    e.target.checked ? showCam() : hideCam();
  });
  HMOAudioSwitch.addEventListener("change", (e) => {
    localStorage.setItem("@hmo_use_audio", e.target.checked);
    audioState = e.target.checked;
    audioBtn.innerHTML = e.target.checked ? audioOnIcon : audioOffIcon;
  });

  // update stop button if recording hasn't started
  if (!startedRecording) {
    stopBtn.classList.add("disabled");
    pauseBtn.classList.add("disabled");
  } else {
    stopBtn.classList.remove("disabled");
    pauseBtn.classList.remove("disabled");
  }

  // update pulse animation
  if (startedRecording) HMOBubbCounterAnim.classList.add("started");
  else HMOBubbCounterAnim.classList.remove("started");

  // update video and audio icon state
  audioState
    ? (audioBtn.innerHTML = audioOnIcon)
    : (audioBtn.innerHTML = audioOffIcon);

  cameraState
    ? (cameraBtn.innerHTML = cameraOnIcon)
    : (cameraBtn.innerHTML = cameraOffIcon);

  // handle closing of HMO Record component
  HMOCloseBtn.onclick = () => {
    HMOContainer.classList.remove("show");
    HMOContainer.classList.add("hide");
  };

  // counter controls counter
  pauseBtn.onclick = () => {
    const dataset = pauseBtn.getAttribute("data-name");
    if (dataset === "pause") {
      updatePauseBtnUI(true);
      counter.pause();
    } else {
      updatePauseBtnUI(false);
      counter.play();
    }

    // pause and resume recording
    if (mediaRecorder.state === "recording") {
      mediaRecorder.pause();
    } else if (mediaRecorder.state === "paused") {
      mediaRecorder.resume();
    }
  };
  stopBtn.onclick = async () => {
    counter.stop();
    startedRecording = false;
    stopBtn.classList.add("disabled");
    pauseBtn.classList.add("disabled");
    HMOStartRecordingBtn.classList.remove("disabled");
    HMOStartRecordingBtn.removeAttribute("disabled");
    shouldRestart = true;

    // stop recorder
    mediaRecorder.stop();

    // display preview video
    await sleep(1);
    HMOPreviewVideoContainer.classList.remove("hide");
    HMOPreviewVideoContainer.classList.add("show");
    HMOPreviewVideo.src = recordedBlobUrl;

    // show the record component
    HMORecorderComp.classList.remove("hide");
    HMORecorderComp.classList.add("show");

    // hide recorder ui component
    hideRecorderComp();
    // save recording to storage
  };

  // start recording button
  HMOStartRecordingBtn.onclick = async () => {
    if (startedRecording) return;
    const shouldStart = await startRecording();
    if (shouldStart) {
      startedRecording = true;
      pauseBtn.classList.remove("disabled");
      stopBtn.classList.remove("disabled");
      HMOBubbCounterAnim.classList.add("started");
      HMOStartRecordingBtn.setAttribute("disabled", true);
      HMOStartRecordingBtn.classList.add("disabled");
      HMORecorderComp.classList.remove("show");
      HMORecorderComp.classList.add("hide");
    }
  };

  //   save video
  HMOSaveVideo.onclick = async () => {
    const blob = new Blob(recordedChunks, {
      type: recordedChunks[0].type,
    });
    const formData = new FormData();
    formData.append("videoFile", blob);
    try {
      HMOSaveVideo.innerHTML = "Saving...";
      // Send the FormData in a POST request
      const url = `${API_BASE_URL}/video/save`;
      const req = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const result = await req.json();
      if (req.status !== 200) {
        window.alert(result?.message);
        return;
      }
      HMOSaveVideo.innerHTML = "Save Video";
    } catch (e) {
      HMOSaveVideo.innerHTML = "Save Video";
      window.alert(`Something went wrong.`);
      console.log(`Something went wrong saving video: ${e}`);
    }
  };

  // cancel video
  HMOCancelVideo.onclick = () => {
    HMOPreviewVideoContainer.classList.remove("show");
    HMOPreviewVideoContainer.classList.add("hide");

    // hide main HMO RECORDING CONTAINER
    HMOContainer.classList.remove("show");
    HMOContainer.classList.add("hide");

    // hide main frame container
    toggleScreenRecord();

    // reload page to reset all state
    window.location.reload();
  };

  //   convert blob to base64
  function blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  // start recording button
  async function startRecording() {
    try {
      let stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      if (mediaRecorder === null) {
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: mime,
        });
        mediaRecorder.addEventListener("dataavailable", function (e) {
          recordedChunks.push(e.data);
        });

        mediaRecorder.addEventListener("stop", function () {
          let blob = new Blob(recordedChunks, {
            type: recordedChunks[0].type,
          });
          recordedBlobUrl = URL.createObjectURL(blob);
          stream.getTracks()[0].stop();
        });

        mediaRecorder.start();
        return true;
      }
    } catch (e) {
      console.log(`error starting recorder`);
      return false;
    }
  }

  function updatePauseBtnUI(isPaused = true) {
    if (isPaused) {
      pauseBtn.innerHTML = playIcon;
      pauseBtn.setAttribute("data-name", "play");
    } else {
      pauseBtn.innerHTML = `
            <svg
                    width="128"
                    height="128"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon"
                  >
                    <path
                      fill=""
                      d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z"
                    />
                  </svg>
        `;
      pauseBtn.setAttribute("data-name", "pause");
    }
  }

  // update count down
  function updateCounterCont(hr, min, sec) {
    HMOBubbCounter.innerHTML = `${hr > 9 ? hr : "0" + hr}:${
      min > 9 ? min : "0" + min
    }:${sec > 9 ? sec : "0" + sec}`;
  }

  //  counter
  function bubbleCounter() {
    return {
      pause: () => {
        isTimerPaused = true;
      },
      play: () => {
        isTimerPaused = false;
      },
      stop: () => {
        isTimerPaused = true;
        min = 0;
        sec = 0;
        hr = 0;
        updateCounterCont(hr, min, sec);
        clearInterval(timerInterval);
      },
    };
  }

  //   hide recorder UI component
  function hideRecorderComp() {
    HMORecorderBubbComp.classList.remove("show");
    HMORecorderComp.classList.remove("show");

    HMORecorderBubbComp.classList.add("hide");
    HMORecorderComp.classList.add("hide");
  }

  // handle users webcam
  function stopCam() {
    if (!HMOBubbUserVideo) return;
    let stream = HMOBubbUserVideo.srcObject;
    let tracks = stream?.getTracks();
    typeof tracks !== "undefined" && tracks?.forEach((track) => track.stop());
    HMOBubbUserVideo.srcObject = null;
  }

  function startCam() {
    if (!HMOBubbUserVideo) return;
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: audioState })
        .then((stream) => {
          HMOBubbUserVideo.srcObject = stream;
          HMOBubbUserVideo.addEventListener("loadedmetadata", () => {
            HMOBubbUserVideo.play();
          });
        })
        .catch(function (error) {
          console.log("Something went wrong!");
        });
    }
  }

  function hideCam() {
    HMOBubbUserVideo.classList.add("hide");
    HMOBubbUserVideo.classList.remove("show");
    stopCam();
  }

  function showCam() {
    HMOBubbUserVideo.classList.remove("hide");
    HMOBubbUserVideo.classList.add("show");
    startCam();
  }
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
  } else {
    mainDiv.classList.add("show");
  }
  mainDiv.classList.toggle("hide");
}

function Draggable(draggableElement, affectedElement, container) {
  let isDragging = false;
  let offsetX, offsetY;

  draggableElement.addEventListener("mousedown", (e) => {
    isDragging = true;
    const rect = draggableElement.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    affectedElement.style.zIndex = "1";
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

      affectedElement.style.left = x + "px";
      affectedElement.style.top = y + "px";
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    affectedElement.style.zIndex = "0";
  });
}
