import { tracks } from "./tracks";
import {
  addTrackToUI,
  loadTrackToUI,
  refreshBackground,
  UIObjects,
} from "./ui";

const player = {
  isPlaying: false,
  isShuffling: false,
  tracks: [],
  currentTrackIndex: 0,
  previousTrackIndex: 0,
  nextTrackIndex: 1,
  minValue: 0,
  maxValue: 0,
  playbackArray: [],
  createPlaybackArray: (val, array) => {
    for (let i = 0; i <= val; i++) {
      array.push(player.tracks[i].name);
    }
  },
  reset: () => {
    UIObjects.currentTime.textContent = "00:00";
    UIObjects.totalDuration.textContent = "00:00";
    UIObjects.seekSlider.value = 0;
  },
  playPauseTrack: () => {
    if (!player.isPlaying) return player.play();

    player.pause();
  },
  play: () => {
    UIObjects.currentAudio.play();
    player.isPlaying = true;
    UIObjects.playPauseButton.innerHTML =
      '<i class="fa fa-pause-circle fa-5x"></i>';
  },
  pause: () => {
    UIObjects.currentAudio.pause();
    player.isPlaying = false;
    UIObjects.playPauseButton.innerHTML =
      '<i class="fa fa-play-circle fa-5x"></i>';
  },
  load: (trackIdx) => {
    console.log(
      "Now playing track:",
      player.currentTrackIndex
    );
    console.log(
      "Previous track:",
      player.previousTrackIndex
    );
    console.log(
      "Next track:",
      player.nextTrackIndex
    );
    clearInterval(updateTimer);
    player.reset();
    loadTrackToUI(
      player.currentTrackIndex,
      player.previousTrackIndex,
      player.tracks.length,
      player.tracks[trackIdx].name,
      player.tracks[trackIdx].path,
      player.tracks[trackIdx].image,
      player.tracks[trackIdx].artist
    );

    updateTimer = setInterval(player.updateProgressBar, 1000);
    refreshBackground();
  },
  // changeTrack: (changeType) => {
  //   // Update Indexes Based on Change Type
  //   if (changeType === "next") {
  //     player.previousTrackIndex += 1;
  //     player.currentTrackIndex = player.nextTrackIndex;
  //   } else if (changeType === "previous") {
  //     player.nextTrackIndex -= 1;
  //     player.currentTrackIndex = player.previousTrackIndex;
  //   } else if (changeType === "playlist") {
  //   } else {
  //     console.error("Invalid track change type:", type);
  //   }
  //   console.log(
  //     changeType,
  //     "current:",
  //     player.currentTrackIndex,
  //     "prev:",
  //     player.previousTrackIndex,
  //     "next:",
  //     player.nextTrackIndex
  //   );
  //   // player.load(player.currentTrackIndex);
  //   // player.play();
  // },
  playNext: () => {
    console.log("playNext called");
    if (player.isShuffling) {
      player.nextTrackIndex = player.shuffleNextTrack();
    } else {
      player.previousTrackIndex = player.currentTrackIndex;
      player.currentTrackIndex = player.nextTrackIndex;
      player.nextTrackIndex =
        (player.nextTrackIndex + 1) % player.playbackArray.length;
      // if (player.nextTrackIndex < player.maxValue) {
      //   player.nextTrackIndex++;
      // } else {
      //   player.nextTrackIndex = player.minValue;
      // }
    }
    player.load(player.currentTrackIndex);
    player.play();
    // console.log(
    //   "Now playing track:",
    //   player.playbackArray[player.currentTrackIndex]
    // );
    // console.log(
    //   "Previous track:",
    //   player.playbackArray[player.previousTrackIndex]
    // );
  },
  playPrevious: () => {
    if(player.currentTrackIndex <= 0 ){
      player.previousTrackIndex = player.maxValue;
    } else {
      player.previousTrackIndex--;
    }
   
    // player.previousTrackIndex =
    //   (player.previousTrackIndex - 1 + player.playbackArray.length) %
    //   player.playbackArray.length;

    // console.log(
    //   "Now playing track:",
    //   player.playbackArray[player.currentTrackIndex]
    // );
    // console.log(
    //   "Previous track:",
    //   player.playbackArray[player.previousTrackIndex]
    // );
    // if (player.previousTrackIndex == player.minValue) {
    //   //listenin başına döndüyse
    //   //listenin sonuna at
    //   player.previousTrackIndex = player.maxValue;
    // } else {
    //   player.previousTrackIndex -= 1;
    // }
    player.load(player.previousTrackIndex);
    player.play();
    player.nextTrackIndex = player.currentTrackIndex;
    player.currentTrackIndex = player.previousTrackIndex;
    // if (
    //   UIObjects.currentAudio.currentTime > 5 &&
    //   UIObjects.currentAudio.currentTime < 10
    // ) {
    //   console.log("somewhere between 5 to 10");
    //   // TODO: start over
    // } else {
    // }
  },
  setVolume: (volume) => {
    UIObjects.currentAudio.volume = UIObjects.volumeSlider.value / 100;
  },
  setProgressBar: () => {
    UIObjects.currentAudio.currentTime =
      UIObjects.currentAudio.duration * (UIObjects.seekSlider.value / 100);
  },
  updateProgressBar: () => {
    let seekPosition = 0;

    if (!isNaN(UIObjects.currentAudio.duration)) {
      seekPosition =
        UIObjects.currentAudio.currentTime *
        (100 / UIObjects.currentAudio.duration);

      UIObjects.seekSlider.value = seekPosition;

      let currentMinutes = Math.floor(UIObjects.currentAudio.currentTime / 60);
      let currentSeconds = Math.floor(
        UIObjects.currentAudio.currentTime - currentMinutes * 60
      );
      let durationMinutes = Math.floor(UIObjects.currentAudio.duration / 60);
      let durationSeconds = Math.floor(
        UIObjects.currentAudio.duration - durationMinutes * 60
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

      UIObjects.currentTime.textContent = currentMinutes + ":" + currentSeconds;
      UIObjects.totalDuration.textContent =
        durationMinutes + ":" + durationSeconds;
    }
  },
  shuffleNextTrack: () => {
    while (true) {
      const randomIndex = Math.floor(Math.random() * player.tracks.length);
      if (
        randomIndex !== player.currentTrackIndex &&
        randomIndex !== player.previousTrackIndex
      ) {
        return randomIndex;
      }
    }
  },
};

let updateTimer;

function generatePlaylist() {
  if (player.tracks.length === 0) {
    player.tracks = tracks; // put tracks into player object

    for (let i = 0; i < player.tracks.length; i++) {
      addTrackToUI(
        player.tracks[i].name,
        player.tracks[i].artist,
        player.tracks[i].image
      );
    }
  } else {
    console.log(
      "There is already a list of " + player.tracks.length + " songs!"
    );
    return false;
  }
}
function playFromList(event) {
  // Check if the clicked element is an <li> element
  if (event.target.tagName.toLowerCase() === "li") {
    // Get the index of the clicked list item
    let clickedIndex = Array.from(UIObjects.trackList.children).indexOf(
      event.target
    );
    if (clickedIndex !== player.currentTrackIndex) {
      player.load(clickedIndex);
      player.play();
    }
  }
}

function initializePlayer() {
  generatePlaylist();
  player.maxValue = player.tracks.length - 1;
  player.createPlaybackArray(player.maxValue, player.playbackArray);
  player.previousTrackIndex = player.maxValue;

  player.load(player.currentTrackIndex);
}

// event listeners

let isSpaceBarCooldown = false;
const shuffleButton = document.querySelector(".shuffle-button");
const shuffleIcon = document.querySelector(".shuffle-icon");

//listening to main points of interaction

UIObjects.playPauseButton.addEventListener("click", player.playPauseTrack);
UIObjects.nextButton.addEventListener("click", player.playNext);
UIObjects.previousButton.addEventListener("click", player.playPrevious);
UIObjects.seekSlider.addEventListener("change", player.setProgressBar);
UIObjects.volumeSlider.addEventListener("change", player.setVolume);
UIObjects.trackList.addEventListener("click", playFromList);
UIObjects.currentAudio.addEventListener("ended", player.playNext);

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
      player.playPauseTrack();
    }
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === " " || event.keyCode === 32) {
    isSpaceBarCooldown = false; // Reset cooldown when key is released
  }
});

//listening the shuffle button

shuffleButton.addEventListener("click", () => {
  player.isShuffling = !player.isShuffling; // Toggle the shuffle state

  if (player.isShuffling) {
    shuffleIcon.classList.add("shuffleActive");
    // Add your logic to shuffle the playlist here
  } else {
    shuffleIcon.classList.remove("shuffleActive");
    // Add your logic to return to normal playback here
  }
});

initializePlayer();
