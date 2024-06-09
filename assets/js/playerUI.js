import ColorThief from "colorthief";
const colorThief = new ColorThief();

let colorArray;

export const UIObjects = {
  currentAudio: document.createElement("audio"),
  trackList: document.getElementById("track-list"),
  currentTrackArt: document.getElementById("track-art"),
  seekSlider: document.querySelector(".seek_slider"),
  currentTime: document.querySelector(".current-time"),
  totalDuration: document.querySelector(".total-duration"),
  playPauseButton: document.querySelector(".playpause-track"),
  previousButton: document.querySelector(".prev-track"),
  nextButton: document.querySelector(".next-track"),
  volumeSlider: document.querySelector(".volume_slider"),
  shuffleButton: document.querySelector(".shuffle-button"),
  shuffleIcon: document.querySelector(".shuffle-icon"),
  muteIcon: document.getElementById("volume-mute-icon"),
  repeatButton: document.querySelector(".repeat-button"),
  repeatIcon: document.getElementById("repeat-icon"),
  likesCount: document.getElementById("likesCount"),
  dislikesCount: document.getElementById("dislikesCount"),
  thumbsUp: document.getElementById("thumbsUp"),
  thumbsDown: document.getElementById("thumbsDown"),
};




export const addTrackToUI = (trackName, trackArtist, trackImage) => {
  const listItem = document.createElement("li");
  const listDiv = document.createElement("div");
  listItem.classList.add("track-item");

  const trackTitleObj = document.createElement("h3");
  trackTitleObj.textContent = trackName;
  const trackArtistObj = document.createElement("p");
  trackArtistObj.textContent = trackArtist;
  const trackImageObj = document.createElement("img");
  trackImageObj.src = trackImage;

  listItem.append(trackImageObj, listDiv);
  listDiv.append(trackTitleObj, trackArtistObj);

  UIObjects.trackList.appendChild(listItem);
};

export const loadTrackToUI = (
  currentTrackIndex,
  previousTrackIndex,
  tracksCount,
  trackName,
  trackPath,
  trackImage,
  trackArtist,
  trackLikes,
  trackDislikes,
  trackListens
) => {
  UIObjects.currentAudio.src = trackPath;
  UIObjects.currentAudio.load();

  for (const child of UIObjects.trackList.children) {
    child.classList.remove("active");
  }
  UIObjects.trackList.children[currentTrackIndex].classList.add("active");

  UIObjects.currentTrackArt.src = trackImage;
  document.querySelector(".track-name").textContent = trackName;
  document.querySelector(".track-artist").textContent = trackArtist;
  document.querySelector(".now-playing").textContent =
    "PLAYING " + (currentTrackIndex + 1) + " OF " + tracksCount + " - " + trackListens + " listens";
    UIObjects.likesCount.textContent = trackLikes;
    UIObjects.dislikesCount.textContent = trackDislikes;
};

export const backgroundUI = {
  refreshBackground: () => {
    if (UIObjects.currentTrackArt.complete) {
      colorArray = colorThief.getPalette(UIObjects.currentTrackArt);
      backgroundUI.applyGradient(colorArray); // Apply gradient if colors are ready
    } else {
      UIObjects.currentTrackArt.addEventListener("load", function () {
        colorArray = colorThief.getPalette(UIObjects.currentTrackArt);
        backgroundUI.applyGradient(colorArray); // Apply gradient after image loads
      });
    }
  },
  applyGradient: (colors) => {
    if (!colors) return;

    const gradient = backgroundUI.generateGradientString(colors);
    document.body.style.cssText = `background: ${gradient};`;
  },
  generateGradientString: (colors) => {
    const randomAngle = Math.floor(Math.random() * 181);

    let gradientString = `linear-gradient(${randomAngle + "deg"}, `;
    for (let i = 0; i < colors.length; i++) {
      const rgbString = `rgb(${colors[i][0]}, ${colors[i][1]}, ${colors[i][2]})`;
      gradientString += rgbString;
      if (i < colors.length - 1) {
        gradientString += ", ";
      }
    }
    gradientString += ")";
    return gradientString;
  },
};
