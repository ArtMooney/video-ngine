var videoId = [];
var i;
for (i = 0; i < videosOnPage.length; i++) {
  videoId[i] = document.getElementById(videosOnPage[i].videoId);
}

var mobileBreakpoint = window.matchMedia("(max-width: 768px)");

function addSourceToVideo(element, src, type, id) {
  var source = document.createElement("source");
  source.src = src;
  source.type = type;
  source.id = id;
  element.appendChild(source);
}

function alternateSources(video, source, src) {
  if (source) {
    if (video.paused) {
      video.pause();
    }
    source.src = src;
  }
}

function switchVideoMode(mobileBreakpoint, init) {
  if (init === undefined) {
    init = false;
  }
  for (i = 0; i < videosOnPage.length; i++) {
    var video = document.getElementById(videosOnPage[i].videoId);
    var sourceMp4 = document.getElementById(videosOnPage[i].videoId + "mp4");
    var sourceWebm = document.getElementById(videosOnPage[i].videoId + "webm");
    if (mobileBreakpoint.matches) {
      if (!sourceMp4) {
        addSourceToVideo(
          videoId[i],
          videosOnPage[i].mp4Mob,
          "video/mp4",
          videosOnPage[i].videoId + "mp4"
        );
      } else {
        alternateSources(video, sourceMp4, videosOnPage[i].mp4Mob);
      }
      if (!sourceWebm) {
        addSourceToVideo(
          videoId[i],
          videosOnPage[i].webmMob,
          "video/webm",
          videosOnPage[i].videoId + "webm"
        );
      } else {
        alternateSources(video, sourceWebm, videosOnPage[i].webmMob);
      }
      if (!init) {
        if (!video.paused) {
          video.load();
          video.play();
        }
      }
    } else {
      if (!sourceMp4) {
        addSourceToVideo(
          videoId[i],
          videosOnPage[i].mp4,
          "video/mp4",
          videosOnPage[i].videoId + "mp4"
        );
      } else {
        alternateSources(video, sourceMp4, videosOnPage[i].mp4);
      }
      if (!sourceWebm) {
        addSourceToVideo(
          videoId[i],
          videosOnPage[i].webm,
          "video/webm",
          videosOnPage[i].videoId + "webm"
        );
      } else {
        alternateSources(video, sourceWebm, videosOnPage[i].webm);
      }
      if (!init) {
        if (!video.paused) {
          video.load();
          video.play();
        }
      }
    }
  }
}

function getVideoElement(event) {
  var video;
  for (var s = 0; s < videosOnPage.length; s++) {
    if (
      videosOnPage[s].controllerId === event.srcElement.parentElement.id ||
      videosOnPage[s].controllerId ===
        event.srcElement.parentElement.parentElement.id
    ) {
      video = document.getElementById(videosOnPage[s].videoId);
    }
  }

  return video;
}

switchVideoMode(mobileBreakpoint, true);
mobileBreakpoint.addEventListener("change", switchVideoMode);

window.addEventListener(
  "orientationchange",
  function () {
    window.location.reload();
  },
  false
);

for (i = 0; i < videosOnPage.length; i++) {
  var playButton = document
    .getElementById(videosOnPage[i].controllerId)
    .getElementsByClassName("play-pause")[0];

  var muteButton = document
    .getElementById(videosOnPage[i].controllerId)
    .getElementsByClassName("mute")[0];

  var fullScreenButton = document
    .getElementById(videosOnPage[i].controllerId)
    .getElementsByClassName("fullscreen")[0];

  var seekBar = document
    .getElementById(videosOnPage[i].controllerId)
    .getElementsByClassName("seek-bar")[0];

  var volumeBar = document
    .getElementById(videosOnPage[i].controllerId)
    .getElementsByClassName("volume-bar")[0];

  if (playButton !== undefined && playButton !== "") {
    playButton.addEventListener("click", function (event) {
      var video = getVideoElement(event);
      var subDivs = event.srcElement.parentElement.getElementsByTagName("div");
      if (video.paused === true) {
        video.play();
        for (var s = 0; s < subDivs.length; s++) {
          if (s < 1) {
            subDivs[s].style.display = "block";
          } else {
            subDivs[s].style.display = "none";
          }
        }
      } else {
        video.pause();
        for (var s = 0; s < subDivs.length; s++) {
          if (s < 1) {
            subDivs[s].style.display = "none";
          } else {
            subDivs[s].style.display = "block";
          }
        }
      }
    });
  }

  if (muteButton !== undefined && muteButton !== "") {
    muteButton.addEventListener("click", function (event) {
      var video = getVideoElement(event);
      var subDivs = event.srcElement.parentElement.getElementsByTagName("div");

      if (video.muted === false) {
        video.muted = true;
        for (var s = 0; s < subDivs.length; s++) {
          if (s < 1) {
            subDivs[s].style.display = "none";
          } else {
            subDivs[s].style.display = "block";
          }
        }
      } else {
        video.muted = false;
        for (var s = 0; s < subDivs.length; s++) {
          if (s < 1) {
            subDivs[s].style.display = "block";
          } else {
            subDivs[s].style.display = "none";
          }
        }
      }
    });
  }

  if (fullScreenButton !== undefined && fullScreenButton !== "") {
    fullScreenButton.addEventListener("click", function (event) {
      var video = getVideoElement(event);

      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();
      } else if (video.webkitSupportsFullscreen) {
        video.webkitEnterFullscreen();
      }
    });
  }

  // Go to the changed time
  if (seekBar !== undefined && seekBar !== "") {
    seekBar.addEventListener("click", function (event) {
      var video = getVideoElement(event);
      var time = video.duration * (event.srcElement.value / 100);
      video.currentTime = time;

      event.srcElement.style.display = "none";
      setTimeout(() => {
        event.srcElement.style.display = "block";
      }, 0);
    });
  }

  // Update the seek bar as the video plays
  if (videoId[i] !== undefined && videoId[i] !== "") {
    videoId[i].addEventListener("timeupdate", function (event) {
      var eventSeekBar;

      for (var s = 0; s < videosOnPage.length; s++) {
        if (event.srcElement.id === videosOnPage[s].videoId) {
          eventSeekBar = document.getElementById(videosOnPage[s].controllerId);
          eventSeekBar = eventSeekBar.getElementsByClassName("seek-bar")[0];
        }
      }

      var video = event.srcElement;
      var value = (100 / video.duration) * video.currentTime;
      eventSeekBar.value = value;
    });
  }

  // Pause the video when the seek handle is being dragged
  if (seekBar !== undefined && seekBar !== "") {
    seekBar.addEventListener("mousedown", function (event) {
      var video = getVideoElement(event);
      video.pause();
    });
  }

  // Play the video when the seek handle is dropped
  if (seekBar !== undefined && seekBar !== "") {
    seekBar.addEventListener("mouseup", function (event) {
      var video = getVideoElement(event);
      video.play();
    });
  }

  // Event listener for the volume bar
  // Volume bar current do not work on iOS due to apple restrictions
  if (volumeBar !== undefined && volumeBar !== "") {
    volumeBar.addEventListener("change", function (event) {
      var video = getVideoElement(event);
      video.volume = volumeBar.value;
    });
  }
}
