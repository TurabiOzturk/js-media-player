//two simple linting rules:
// snake_case for CSS selector variables
// camelCase for everything else

// import ColorThief from "../../node_modules/colorthief/dist/color-thief.mjs";
import ColorThief from "colorthief";
import { trackObject } from "./track_object";
import { selector } from "./selectors";

let isPlayListGenerated = false;
let nowPlaying;

let trackIndex = 0;
let isPlaying = false;
let updateTimer;
let colorArray;
let isSpaceBarCooldown = false;

function generatePlaylist() {
  if (isPlayListGenerated !== true) {
    for (let i = 0; i < trackObject.length; i++) {
      nowPlaying = i;
      const trackItem = trackObject[i];
      const listItem = document.createElement("li");
      const listDiv = document.createElement("div");
      listItem.classList.add("track-item");

      const trackTitle = document.createElement("h3");
      trackTitle.textContent = trackItem.name;
      const trackArtist = document.createElement("p");
      trackArtist.innerHTML = trackItem.artist;
      const trackImage = document.createElement("img");
      trackImage.src = trackItem.image;

      // Append elements to the list item
      listItem.append(trackImage, listDiv);
      // listItem.appendChild(trackImage);
      // listItem.appendChild(listDiv);
      listDiv.append(trackTitle, trackArtist);
      // listDiv.appendChild(trackTitle);
      // listDiv.appendChild(trackArtist);

      // Append the list item to the track list element
      selector.track_list.appendChild(listItem);
      isPlayListGenerated = true;
    }
  } else {
    //console.log("There is already a trackObject of " +track_list.length+ " songs!");
  }
}

// obsolete
function random_bg_color() {
  // Get a number between 64 to 256 (for getting lighter colors)
  let red = Math.floor(Math.random() * 256) + 64;
  let green = Math.floor(Math.random() * 256) + 64;
  let blue = Math.floor(Math.random() * 256) + 64;

  // Construct a color withe the given values
  let bgColor = "rgb(" + red + "," + green + "," + blue + ")";

  // Set the background to that color
  document.body.style.background = bgColor;
}

function generateGradientString(colors) {
  const randomAngle = Math.floor(Math.random() * 181);

  let gradientString = `linear-gradient(${randomAngle + "deg"}, `; // Change "to right" for a different direction
  for (let i = 0; i < colors.length; i++) {
    const rgbString = `rgb(${colors[i][0]}, ${colors[i][1]}, ${colors[i][2]})`;
    gradientString += rgbString;
    if (i < colors.length - 1) {
      gradientString += ", ";
    }
  }
  gradientString += ")";
  return gradientString;
}

const colorThief = new ColorThief();

const shuffleButton = document.querySelector(".shuffle-button");
const shuffleIcon = document.querySelector(".shuffle-icon");
let isShuffle = false; // Initial shuffle state

shuffleButton.addEventListener("click", () => {
  isShuffle = !isShuffle; // Toggle the shuffle state

  if (isShuffle) {
    shuffleIcon.classList.add("shuffleActive");
    // Add your logic to shuffle the playlist here
  } else {
    shuffleIcon.classList.remove("shuffleActive");
    // Add your logic to return to normal playback here
  }
});
function loadTrack(trackIndex) {
  clearInterval(updateTimer);
  resetValues();
  generatePlaylist();

  selector.curr_track.src = trackObject[trackIndex].path;
  selector.curr_track.load();

  selector.track_list.children[trackIndex].classList.add("active");
  selector.track_list.children[nowPlaying].classList.remove("active");
  nowPlaying = trackIndex;

  selector.track_art.src = `${trackObject[trackIndex].image}`;
  selector.track_name.textContent = trackObject[trackIndex].name;
  selector.track_artist.textContent = trackObject[trackIndex].artist;
  selector.now_playing.textContent =
    "PLAYING " + (trackIndex + 1) + " OF " + trackObject.length;

  updateTimer = setInterval(seekUpdate, 1000);
  // selector.curr_track.addEventListener("ended", () => {
  //   if (isShuffle) {
  //     console.log("shuffle on");
  //     const randomSong = Math.floor(Math.random() * trackObject.length -1);
  //     loadTrack(randomSong);
  //   } else {
  //     console.log("shuffle off");
  //     nextTrack();
  //   }
  // });

  if (selector.track_art.complete) {
    colorArray = colorThief.getPalette(selector.track_art);
  } else {
    selector.track_art.addEventListener("load", function () {
      colorArray = colorThief.getPalette(selector.track_art);
      generateGradientString(colorArray);
      const gradient = generateGradientString(colorArray);
      document.body.style.cssText = `
      background: ${gradient}; 
      `;
    });
  }
}

function resetValues() {
  selector.curr_time.textContent = "00:00";
  selector.total_duration.textContent = "00:00";
  selector.seek_slider.value = 0;
}

function playpauseTrack() {
  if (!isPlaying) playTrack();
  else pauseTrack();
}

function playTrack() {
  selector.curr_track.play();
  isPlaying = true;
  selector.playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseTrack() {
  selector.curr_track.pause();
  isPlaying = false;
  selector.playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

function nextTrack() {
  if (trackIndex < trackObject.length - 1) {
    trackIndex += 1;
  } else {
    trackIndex = 0;
  }
  //   trackObject.children[trackIndex].classList.add('active');
  //   trackObject.children[nowPlaying].classList.remove('active');

  loadTrack(trackIndex);
  playTrack();
}
function prevTrack() {
  if (
    selector.curr_track.currentTime > 5 &&
    selector.curr_track.currentTime < 10
  ) {
    console.log("somewhere between 5 to 10");
  } else {
    console.log("somewhere else");
    //DIS NOT WORKEN
    if (trackIndex > 0) trackIndex -= 1;
    else trackIndex = trackObject.length - 1;
  }
  loadTrack(trackIndex);
  playTrack();
}
function playFromList(event) {
  // Check if the clicked element is an <li> element
  if (event.target.tagName.toLowerCase() === "li") {
    // Get the index of the clicked list item
    let clickedIndex = Array.from(trackObject.children).indexOf(event.target);
    if (clickedIndex == trackIndex) {
      return false;
    } else {
      // Update the trackIndex and load the new track
      trackIndex = clickedIndex;
      loadTrack(trackIndex);
      playTrack();
      // Add the 'active' class to the clicked list item
      // and remove it from the previously active item
      trackObject.querySelector(".active")?.classList.remove("active");
      //FIXME: adding class is already handled in loadTrack
      //why does it not work when I comment out the below line?
      event.target.classList.add("active");
    }
  }
}

// Add the event listener to the trackObject element

function seekTo() {
  let seekto =
    selector.curr_track.duration * (selector.seek_slider.value / 100);
  selector.curr_track.currentTime = seekto;
}

function setVolume() {
  selector.curr_track.volume = selector.volume_slider.value / 100;
}

function seekUpdate() {
  let seekPosition = 0;

  if (!isNaN(selector.curr_track.duration)) {
    seekPosition =
      selector.curr_track.currentTime * (100 / selector.curr_track.duration);

    selector.seek_slider.value = seekPosition;

    let currentMinutes = Math.floor(selector.curr_track.currentTime / 60);
    let currentSeconds = Math.floor(
      selector.curr_track.currentTime - currentMinutes * 60
    );
    let durationMinutes = Math.floor(selector.curr_track.duration / 60);
    let durationSeconds = Math.floor(
      selector.curr_track.duration - durationMinutes * 60
    );

    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }
    if (durationSeconds < 10) {
      durationSeconds = "0" + durationSeconds;
    }
    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    }
    if (durationMinutes < 10) {
      durationMinutes = "0" + durationMinutes;
    }

    selector.curr_time.textContent = currentMinutes + ":" + currentSeconds;
    selector.total_duration.textContent =
      durationMinutes + ":" + durationSeconds;
  }
}

 
//play/pause with the space bar
document.addEventListener("keydown", (event) => {
  
  if (
    (event.key === " " || event.keyCode === 32) &&
    !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
  ) {
    event.preventDefault(); // Prevent page scrolling

    if (!isSpaceBarCooldown) {
      //Only trigger this once per spacebar press.
      isSpaceBarCooldown = true; // Set cooldown while key is down
      playpauseTrack();
    }
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === " " || event.keyCode === 32) {
    isSpaceBarCooldown = false; // Reset cooldown when key is released
  }
});

selector.playpause_btn.addEventListener("click", playpauseTrack);
selector.next_btn.addEventListener("click", nextTrack);
selector.prev_btn.addEventListener("click", prevTrack);
selector.seek_slider.addEventListener("change", seekTo);
selector.volume_slider.addEventListener("change", setVolume);
selector.track_list.addEventListener("click", playFromList);
selector.curr_track.addEventListener("ended", nextTrack);

loadTrack(trackIndex);
