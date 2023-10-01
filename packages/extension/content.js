chrome.runtime.onMessage.addListener(function (msg, sender) {
  if (msg?.msg == "open_recorder") {
    console.log("MESSAGE RECEIVED");
    localStorage.setItem("@hmo_tabId", msg?.tab?.id);
    localStorage.setItem("@hmo_tab_streamId", msg?.streamId);
    toggleScreenRecord();
  }
});

// var is been used rather than let, bcos
// once the script get excuted on tab change
// redeclaration of variables error occurs.

var $ = (elm) => document.querySelector(elm);
var $all = (elm) => document.querySelectorAll(elm);
var sleep = (time = 1) => new Promise((res) => setTimeout(res, time * 1000));

// random id generator
var randomId = (len = 10) => {
  let char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij012345678".split("");
  let id = "";
  for (let i = 0; i < len; i++) {
    const rand = Math.floor(Math.random() * char.length);
    id += char[rand];
  }
  return id;
};

window.addEventListener("DOMContentLoaded", async () => {
  insertIframe();

  // wait 2sec before continuing
  await sleep(1);

  // draggable
  Draggable($(".help-me-bubble-control"), $(".help-me-container"));

  // backend api / client url
  // var CLIENT_URL = "http://localhost:3000";
  var CLIENT_URL = "https://helpmeoutapp.vercel.app";
  var API_BASE_URL = `https://seashell-app-4jicj.ondigitalocean.app/api`;
  // var API_BASE_URL = `http://localhost:8080/api`;

  // recording components
  var HMOContainer = $(".help-me-iframe-container");
  var HMORecorderComp = $(".help-me-record-comp");
  var HMORecorderBubbComp = $(".help-me-bubble-control");
  var HMOCloseBtn = $(".help-me-close-btn");
  var HMOCameraSwitch = $(".help-me-camera-switch");
  var HMOAudioSwitch = $(".help-me-audio-switch");
  var HMOStartRecordingBtn = $(".help-me-start-record-btn");
  var HMOScreenSelection = $all(".hmo-screen-selection-btn");

  // preview video element
  var HMOPreviewVideoContainer = $(".hmo-preview-video");
  var HMOPreviewVideo = $(".hmo-preview-video-tag");
  var HMOSaveVideo = $(".hmo-save-video");
  var HMOCancelVideo = $(".hmo-cancel-video");

  // bubble controls
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
  var videoOff = false;
  var audioOff = false;
  var timerInterval;
  var counter = bubbleCounter();

  // recorder data
  var recordedChunks = [];
  var mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
    ? "video/webm; codecs=vp9"
    : "video/webm";
  var mediaRecorder = null;
  var stream;
  var hmo_streamVideoId = randomId();
  var streamRequestEnded = false;
  var defaultScreen = "current_tab";

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

  // interval to delete active toast
  setInterval(() => {
    Toast().delete();
  }, 5000);

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

  // handle screen selection
  HMOScreenSelection.forEach((btn) => {
    btn.onclick = (e) => {
      const dataset = e.target.dataset["name"];
      defaultScreen = dataset;

      HMOScreenSelection.forEach((btn) => {
        btn.classList.remove("active");
      });

      // Add 'active' class to the clicked button
      btn.classList.add("active");
      defaultScreen = dataset;
    };
  });

  // update audio and camera switch input checked state
  HMOCameraSwitch.toggleAttribute("checked", !!cameraState);
  HMOAudioSwitch.toggleAttribute("checked", !!audioState);

  // prevent displayMedia from getting called in BG.
  setInterval(() => {
    if (HMOContainer.classList.contains("show")) {
      if (cameraState) showCam();
      else if (!startedRecording) hideCam();
    } else {
      stream?.getTracks().forEach((track) => {
        track.stop();
      });
      hideCam();
    }
  }, 100);

  // disable bubble audio button if recording hasn't begun
  // audioBtn.classList.add("disabled");
  // audioBtn.setAttribute("disabled", true);

  // handle camera and audio toggle states
  HMOCameraSwitch.addEventListener("change", (e) => {
    localStorage.setItem("@hmo_use_camera", e.target.checked);
    cameraState = e.target.checked;
    cameraBtn.innerHTML = e.target.checked ? cameraOnIcon : cameraOffIcon;
    e.target.checked ? startCam() : hideCam();
    videoOff = e.target.checked;
  });
  HMOAudioSwitch.addEventListener("change", async (e) => {
    localStorage.setItem("@hmo_use_audio", e.target.checked);
    audioState = e.target.checked;
    audioBtn.innerHTML = e.target.checked ? audioOnIcon : audioOffIcon;
    audioOff = e.target.checked;
    if (e.target.checked) {
      await reqAudioPerm();
    }
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

  // update audio icon state
  audioState
    ? (audioBtn.innerHTML = audioOnIcon)
    : (audioBtn.innerHTML = audioOffIcon);
  audioOff = audioState;

  // set initial camera to camera-off
  cameraBtn.innerHTML = cameraOffIcon;

  // handle closing of HMO Record component
  HMOCloseBtn.onclick = () => {
    HMOContainer.classList.remove("show");
    HMOContainer.classList.add("hide");
  };

  //   toggle audio and video output
  audioBtn.onclick = async () => {
    const audioTracks = stream?.getAudioTracks();
    console.log({ audioTracks });
    if (!audioOff) {
      audioOff = true;
      audioState = true;
      audioBtn.innerHTML = audioOnIcon;
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = true;
      }
    } else {
      audioOff = false;
      audioState = false;
      audioBtn.innerHTML = audioOffIcon;
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = false;
      }
    }
  };

  cameraBtn.onclick = () => {
    if (!videoOff) {
      videoOff = true;
      cameraBtn.innerHTML = cameraOnIcon;
      if (startedRecording) showCam();
      startCam();
    } else {
      videoOff = false;
      cameraBtn.innerHTML = cameraOffIcon;
      if (startedRecording) hideCam();
      stopCam();
    }
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
    if (!streamRequestEnded) {
      await endStream(hmo_streamVideoId);
      streamRequestEnded = true;
      window.open(`${CLIENT_URL}/file/${hmo_streamVideoId}`);
      await sleep(1);
      window.location.reload();
    }
    await resetUIOnRecordStop();
  };

  // start recording button
  HMOStartRecordingBtn.onclick = async () => {
    if (startedRecording) return;
    const shouldStart = await startRecording();
    if (shouldStart) {
      startedRecording = true;
      pauseBtn.classList.remove("disabled");
      stopBtn.classList.remove("disabled");
      audioBtn.classList.remove("disabled");
      audioBtn.removeAttribute("disabled");
      HMOBubbCounterAnim.classList.add("started");
      HMOStartRecordingBtn.setAttribute("disabled", true);
      HMOStartRecordingBtn.classList.add("disabled");
      HMORecorderComp.classList.remove("show");
      HMORecorderComp.classList.add("hide");
    }
  };

  //   save video
  HMOSaveVideo.onclick = async () => {};

  // cancel video
  HMOCancelVideo.onclick = () => {
    HMOPreviewVideoContainer.classList.remove("show");
    HMOPreviewVideoContainer.classList.add("hide");

    // hide main HMO RECORDING CONTAINER
    HMOContainer.classList.remove("show");
    HMOContainer.classList.add("hide");

    // hide main frame container
    toggleScreenRecord();

    window.location.reload();
  };

  // Streams handler
  async function endStream(videoId) {
    try {
      const url = `${API_BASE_URL}/stream/end/${videoId}`;
      const req = await fetch(url);
      const res = await req.json();
      Toast().success(res?.message);
    } catch (e) {
      console.log(`Something went wrong: ${e.message}`);
      // window.alert(res?.message);
      Toast().error(e.message);
    }
  }
  async function streamChunksToServer(chunk) {
    if (chunk.length > 0) {
      const videoBlob = new Blob(recordedChunks, {
        type: chunk[0]?.type,
      });
      const formData = new FormData();
      formData.append("blob", videoBlob);
      formData.append("videoId", hmo_streamVideoId);

      try {
        // Send the FormData in a POST request
        const url = `${API_BASE_URL}/video/stream`;
        const req = await fetch(url, {
          method: "POST",
          body: formData,
        });
        const result = await req.json();
        console.log(`Stream response: ${result?.message}`);
      } catch (e) {
        console.error(`Something went wrong Streaming: ${e?.message}`);
      }
    } else {
      console.info(`Streaming chunk is empty.`);
    }
  }

  // request audio permission
  async function reqAudioPerm() {
    try {
      await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
    } catch (e) {
      window.alert(e.message);
      console.log(`Audio permission denied.`);
    }
  }

  // reset UI component on recording stoped
  async function resetUIOnRecordStop() {
    counter.stop();
    startedRecording = false;
    stopBtn.classList.add("disabled");
    pauseBtn.classList.add("disabled");

    HMOStartRecordingBtn.classList.remove("disabled");
    HMOStartRecordingBtn.removeAttribute("disabled");

    shouldRestart = true;

    // stop recorder
    mediaRecorder.stop();
    stream?.getTracks().forEach((track) => {
      track.stop();
    });

    // Hide Main Container
    HMOContainer.classList.remove("show");
    HMOContainer.classList.add("hide");

    // display preview video
    await sleep(1);
    // HMOPreviewVideoContainer.classList.remove("hide");
    // HMOPreviewVideoContainer.classList.add("show");
    // HMOPreviewVideo.src = recordedBlobUrl;

    // show the record component
    // HMORecorderComp.classList.remove("hide");
    // HMORecorderComp.classList.add("show");

    // hide recorder ui component
    hideRecorderComp();
  }

  // start recording button
  async function startRecording() {
    try {
      let videoInput;
      console.log({ defaultScreen });
      if (defaultScreen === "current_tab") {
        // Capture current tab
        const streamId = JSON.parse(localStorage.getItem("@hmo_tab_stream_id"));
        videoInput = await navigator.mediaDevices.getUserMedia({
          audio: {
            mandatory: {
              chromeMediaSource: "tab",
              chromeMediaSourceId: streamId,
            },
          },
          video: {
            mandatory: {
              chromeMediaSource: "tab",
              chromeMediaSourceId: streamId,
            },
          },
        });
      } else {
        // capture entire screen
        videoInput = await navigator.mediaDevices.getDisplayMedia({
          video: { mediaSource: "screen" },
          audio: audioState,
        });
      }

      let audioInput = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      // combine both media video/audio
      let combineMedia = new MediaStream([
        ...videoInput.getTracks(),
        ...audioInput.getTracks(),
      ]);
      console.log(mediaRecorder);
      if (mediaRecorder === null) {
        mediaRecorder = new MediaRecorder(combineMedia, {
          mimeType: mime,
        });

        mediaRecorder.addEventListener("dataavailable", async function (e) {
          recordedChunks.push(e.data);

          // stream to backend
          const chunk = [e.data];
          await streamChunksToServer(chunk);
        });

        mediaRecorder.addEventListener("stop", async function () {
          let blob = new Blob(recordedChunks, {
            type: recordedChunks[0].type,
          });
          recordedBlobUrl = URL.createObjectURL(blob);
          videoInput.getTracks()[0].stop();
          audioInput.getTracks().forEach((track) => {
            track.stop();
          });

          // update recording ui component
          await resetUIOnRecordStop();

          // end stream
          if (!streamRequestEnded) {
            await endStream(hmo_streamVideoId);
            streamRequestEnded = true;
            window.open(`${CLIENT_URL}/file/${hmo_streamVideoId}`);
          }
        });

        mediaRecorder.start(1000);

        stream = audioInput;
        return true;
      }
    } catch (e) {
      // window.alert(e);
      Toast().error(e);
      console.log(e);
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

  function startCam(audioState) {
    if (!HMOBubbUserVideo) return;
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: audioState })
        .then((vidStream) => {
          stream = vidStream;
          HMOBubbUserVideo.srcObject = vidStream;
          HMOBubbUserVideo.addEventListener("loadedmetadata", () => {
            HMOBubbUserVideo.play();
          });
        })
        .catch(function (error) {
          Toast().error(error.message);
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
    HMOBubbUserVideo.muted = true;
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

function Draggable(element, dragzone) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  element.style.cursor = "grabbing";

  const dragMouseUp = () => {
    document.onmouseup = null;
    document.onmousemove = null;

    element.classList.remove("drag");
  };

  const dragMouseMove = (event) => {
    event.preventDefault();

    pos1 = pos3 - event.clientX;
    pos2 = pos4 - event.clientY;
    pos3 = event.clientX;
    pos4 = event.clientY;

    element.style.top = `${element.offsetTop - pos2}px`;
    element.style.left = `${element.offsetLeft - pos1}px`;
  };

  const dragMouseDown = (event) => {
    event.preventDefault();

    pos3 = event.clientX;
    pos4 = event.clientY;

    element.classList.add("drag");

    document.onmouseup = dragMouseUp;
    document.onmousemove = dragMouseMove;
  };

  dragzone.onmousedown = dragMouseDown;
}

function Toast() {
  const toastComp = $(".hmo-error-component");
  return {
    success: (msg) => {
      toastComp.innerHTML = `<span>${msg}</span>`;
      toastComp.classList.add("success");
      toastComp.classList.add("show");
    },
    error: (msg) => {
      toastComp.innerHTML = `<span>${msg}</span>`;
      toastComp.classList.add("error");
      toastComp.classList.add("show");
    },
    delete: async () => {
      toastComp.classList.remove("show");
      await sleep(1);
      toastComp.classList.remove("success");
      toastComp.classList.remove("error");
      toastComp.innerHTML = "";
    },
  };
}
