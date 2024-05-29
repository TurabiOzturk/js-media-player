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
    clearInterval(updateTimer);
    player.reset();

    player.previousTrackIndex = player.currentTrackIndex;
    player.currentTrackIndex = trackIdx;

    loadTrackToUI(
      player.currentTrackIndex,
      player.previousTrackIndex,
      player.tracks.length,
      player.tracks[player.currentTrackIndex].name,
      player.tracks[player.currentTrackIndex].path,
      player.tracks[player.currentTrackIndex].image,
      player.tracks[player.currentTrackIndex].artist
    );

    updateTimer = setInterval(player.updateProgressBar, 1000);

    refreshBackground();
  },
  playNext: () => {
    let nextTrackIndex = 0;
    if (player.isShuffling) {
      nextTrackIndex = player.shuffleNextTrack();
    } else {
      if (nextTrackIndex < player.tracks.length - 1) {
        nextTrackIndex++;
      } else {
        nextTrackIndex = 0;
      }
    }
    player.load(nextTrackIndex);
    player.play();
  },
  playPrevious: () => {
    if (
      UIObjects.currentAudio.currentTime > 5 &&
      UIObjects.currentAudio.currentTime < 10
    ) {
      console.log("somewhere between 5 to 10");
      // TODO: start over
    } else {
      player.load(
        player.currentTrackIndex > 0
          ? player.currentTrackIndex - 1
          : player.tracks.length - 1
      );
      player.play();
    }
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
      if (randomIndex !== player.currentTrackIndex) {
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
