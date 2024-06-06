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
  repeatState: 0,
  tracks: [],
  repeatStates: {
    "no-repeat": { next: "repeat-one", iconClass: "fa-repeat-off" },
    "repeat-one": { next: "repeat-all", iconClass: "fa-repeat-1" },
    "repeat-all": { next: "no-repeat", iconClass: "fa-repeat" },
  },
  currentState: "no-repeat",
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
  playNext: () => {
    if (player.isShuffling) {
      player.currentTrackIndex = player.shuffleNextTrack(); // Directly update currentTrackIndex
    } else if (player.isRepeat) {
      player.currentTrackIndex = player.currentTrackIndex;
    } else {
      player.currentTrackIndex =
        (player.currentTrackIndex + 1) % player.playbackArray.length; // Increment and wrap around
      // Save the previous index for possible use later
      player.previousTrackIndex =
        (player.currentTrackIndex - 1 + player.playbackArray.length) %
        player.playbackArray.length;
    }

    player.load(player.currentTrackIndex);
    player.play();
  },
  playPrevious: () => {
    let getTrackProgress = UIObjects.currentAudio.currentTime;
    console.log(getTrackProgress);
    getTrackProgress >= 1 && getTrackProgress <= 5
      ? (player.currentTrackIndex = player.currentTrackIndex)
      : // Update currentTrackIndex first
        (player.currentTrackIndex =
          (player.currentTrackIndex - 1 + player.playbackArray.length) %
          player.playbackArray.length); // Decrement and wrap around

    // Save the next index for possible use later
    player.nextTrackIndex =
      (player.currentTrackIndex + 1) % player.playbackArray.length;

    player.load(player.currentTrackIndex);
    player.play();
  },
  setVolume: (volume) => {
    UIObjects.currentAudio.volume = UIObjects.volumeSlider.value / 100;
    console.log(UIObjects.currentAudio.volume);
    UIObjects.currentAudio.volume <= 0.001
      ? UIObjects.muteIcon.classList.add("fa-volume-mute")
      : UIObjects.muteIcon.classList.remove("fa-volume-mute");
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
      const randomIndex = Math.floor(Math.random() * player.maxValue);
      if (
        randomIndex !== player.currentTrackIndex &&
        randomIndex !== player.previousTrackIndex
      ) {
        return randomIndex;
      }
    }
  },
  playFromList: (event) => {
    let clickedIndex = Array.from(UIObjects.trackList.children).indexOf(
      event.target
    );

    // Check if the clicked element is an <li> and not the currently playing track
    if (
      event.target.tagName.toLowerCase() === "li" &&
      clickedIndex !== player.currentTrackIndex
    ) {
      // 1. Update the currentTrackIndex immediately
      player.currentTrackIndex = clickedIndex;

      // 2. Calculate the previousTrackIndex (with wrap-around)
      player.previousTrackIndex =
        (clickedIndex - 1 + player.playbackArray.length) %
        player.playbackArray.length;

      // 3. Calculate the nextTrackIndex (with wrap-around)
      player.nextTrackIndex = (clickedIndex + 1) % player.playbackArray.length;

      // 4. Load and play the selected track
      player.load(player.currentTrackIndex);
      player.play();
    }
  },
  generatePlaylist: () => {
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
  },
  initializePlayer: () => {
    player.generatePlaylist();
    player.maxValue = player.tracks.length - 1;
    player.createPlaybackArray(player.maxValue, player.playbackArray);
    player.previousTrackIndex = player.maxValue;
    player.load(player.currentTrackIndex);
  },
  toggleShuffle: () => {
    player.isShuffling = !player.isShuffling; // Toggle the shuffle state

    if (player.isShuffling) {
      UIObjects.shuffleIcon.classList.add("shuffleActive");
      // Add your logic to shuffle the playlist here
    } else {
      UIObjects.shuffleIcon.classList.remove("shuffleActive");
      // Add your logic to return to normal playback here
    }
  },
  //IN PROGRESS > TODO: FIX IT
  updateRepeatButtonIcon: () => {
    console.log(Object.values(player.repeatStates).map((state) => state.iconClass));
    UIObjects.repeatIcon.classList.remove(
      Object.values(player.repeatStates).map((state) => state.iconClass)
    );
    UIObjects.repeatIcon.classList.add(player.repeatStates[player.currentState].iconClass);
  },
  toggleRepeat: () => {
    console.log(player.currentState);
    // Transition to the next state
    player.currentState = player.repeatStates[player.currentState].next;
    console.log(player.currentState);
    // Update the button's appearance (icon or text)
    player.updateRepeatButtonIcon();
  },
};

let updateTimer;

// event listeners

UIObjects.playPauseButton.addEventListener("click", player.playPauseTrack);
UIObjects.nextButton.addEventListener("click", player.playNext);
UIObjects.previousButton.addEventListener("click", player.playPrevious);
UIObjects.seekSlider.addEventListener("change", player.setProgressBar);
UIObjects.volumeSlider.addEventListener("input", player.setVolume);
UIObjects.trackList.addEventListener("click", player.playFromList);
UIObjects.currentAudio.addEventListener("ended", player.playNext);
UIObjects.shuffleButton.addEventListener("click", player.toggleShuffle);
UIObjects.repeatButton.addEventListener("click", player.toggleRepeat);

//play/pause with the space bar
let isSpaceBarCooldown = false;
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

player.initializePlayer();
UIObjects.repeatIcon.classList.add('fa-repeat')