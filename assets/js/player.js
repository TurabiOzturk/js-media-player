import data from "./data.json";
import {
  addTrackToUI,
  loadTrackToUI,
  backgroundUI,
  UIObjects,
} from "./playerUI";

import { playlistMenuUIObjects, playlistMenu } from "./playlistMenu";

const player = {
  isPlaying: false,
  isShuffling: false,
  repeatState: 0,
  tracks: [],
  repeatStates: {
    "no-repeat": { next: "repeat-one", iconClass: "bi-repeat" },
    "repeat-one": { next: "repeat-all", iconClass: "bi-repeat-1" },
    "repeat-all": { next: "no-repeat", iconClass: "repeat-all" },
  },
  currentRepeatState: "no-repeat",
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
      '<i class="fa fa-pause-circle fa-2x"></i>';
  },
  pause: () => {
    UIObjects.currentAudio.pause();
    player.isPlaying = false;
    UIObjects.playPauseButton.innerHTML =
      '<i class="fa fa-play-circle fa-2x"></i>';
  },
  load: (trackIdx, playlistIdx) => {
    clearInterval(updateTimer);
    player.reset();
    loadTrackToUI(
      player.currentTrackIndex,
      player.previousTrackIndex,
      player.tracks.length,
      player.tracks[trackIdx].name,
      player.tracks[trackIdx].path,
      player.tracks[trackIdx].image,
      player.tracks[trackIdx].artist,
      data.playlists[playlistIdx].listName 
    );

    updateTimer = setInterval(player.updateProgressBar, 1000);
    backgroundUI.refreshBackground();
  },
  playNext: () => {
    if (player.isShuffling) {
      player.currentTrackIndex = player.shuffleNextTrack(); // Directly update currentTrackIndex
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
  restartPlayList: () => {
    player.currentTrackIndex = 0;
    player.previousTrackIndex = 4;
    player.nextTrackIndex = 1;
    player.load(player.currentTrackIndex);
    player.play();
  },
  trackEnded: () => {
    //TODO: if repeat-all and repeat-one is false, stop playback at the last track
    // is this another else if case or another nested if/else statement?

    /*
    no-repeat: continue on next song, normal behavior
    repeat-one: loop current song forever
    repeat-all: if its the last song then go back to first song in playlist
    */

    if (player.currentRepeatState == "repeat-one") {
      player.load(player.currentTrackIndex);
      player.play();

      return;
    }

    if (
      (player.currentRepeatState =
        "repeat-all" && player.currentTrackIndex == player.maxValue)
    ) {
      player.restartPlayList();

      return;
    }

    // if it reaches here that means its no-repeat
    player.currentTrackIndex == player.maxValue
      ? player.playPauseTrack()
      : player.playNext();
  },
  playPrevious: () => {
    let currentTrackProgress = UIObjects.currentAudio.currentTime;

    currentTrackProgress >= 1 && currentTrackProgress <= 5
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
  generatePlaylist: (e) => {
    if (player.tracks.length === 0) {
      e = 0;
      player.tracks = data.playlists[e].tracks; // TODO: fetch proper playlist put tracks into player object

      for (let i = 0; i < player.tracks.length; i++) {
        addTrackToUI(
          player.tracks[i].name,
          player.tracks[i].artist,
          player.tracks[i].image
        );
      }

    } 
    else {
      UIObjects.trackList.innerHTML = ""; // Clear the UI
      console.log(
        "Refreshing playlist, the new list is:",
        data.playlists[e].listName,
        "and it has",
        data.playlists[e].tracks.length,
        "tracks."
      );

      player.tracks = data.playlists[e].tracks; // TODO: fetch proper playlist put tracks into player object

      for (let i = 0; i < player.tracks.length; i++) {
        addTrackToUI(
          player.tracks[i].name,
          player.tracks[i].artist,
          player.tracks[i].image
        );
      }
    }
    player.load(player.currentTrackIndex, e);

  },
  clickPlaylistMenu: (e) => {
    let clickedIndex = Array.from(
      playlistMenuUIObjects.playlistList.children
    ).indexOf(e.target);
    player.generatePlaylist(clickedIndex);
    return clickedIndex;
  },
  initializePlayer: () => {
    player.generatePlaylist(0);
    player.maxValue = player.tracks.length - 1;
    player.createPlaybackArray(player.maxValue, player.playbackArray);
    player.previousTrackIndex = player.maxValue;
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
  updateRepeatButtonIcon: (current, next) => {
    UIObjects.repeatIcon.classList.remove(
      //Object.values(player.repeatStates).map((state) => state.iconClass)
      player.repeatStates[current].iconClass
    );
    UIObjects.repeatIcon.classList.add(player.repeatStates[next].iconClass);
  },
  toggleRepeat: () => {
    // Transition to the next state

    const nextRepeatState = player.repeatStates[player.currentRepeatState].next;
    // Update repeat icon
    player.updateRepeatButtonIcon(player.currentRepeatState, nextRepeatState);
    // Switch current state with the updated state
    player.currentRepeatState = nextRepeatState;
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
UIObjects.currentAudio.addEventListener("ended", player.trackEnded);
UIObjects.shuffleButton.addEventListener("click", player.toggleShuffle);
UIObjects.repeatButton.addEventListener("click", player.toggleRepeat);
playlistMenuUIObjects.playlistList.addEventListener("click",playlistMenu.clickPlaylistMenu);

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
