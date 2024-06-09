import data from "./data.json";
import {
  addTrackToUI,
  loadTrackToUI,
  backgroundUI,
  UIObjects,
} from "./playerUI";

import { playlistMenuUIObjects, playlistMenu } from "./playlistMenu";

const player = {
  currentPlaylist: 0,
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
      player.tracks[trackIdx].artist,
      player.tracks[trackIdx].likes,
      player.tracks[trackIdx].dislikes,
      player.tracks[trackIdx].listenCount
    );

    player.tracks[trackIdx].listenCount++;
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
    UIObjects.trackList.innerHTML = "";
    player.tracks = data.playlists[player.currentPlaylist].tracks; // TODO: fetch proper playlist put tracks into player object
    const sortedTracks = player.tracks.sort(
      (a, b) => a.displayOrder - b.displayOrder
    );
    for (let i = 0; i < sortedTracks.length; i++) {
      if (sortedTracks[i].isActive) {
        addTrackToUI(
          sortedTracks[i].name,
          sortedTracks[i].artist,
          sortedTracks[i].image,
          sortedTracks[i].listenCount
        );
      }
    }
    player.load(player.currentTrackIndex);
  },
  clickPlaylistMenu: (e) => {
    let clickedIndex = Array.from(
      playlistMenuUIObjects.playlistList.children
    ).indexOf(e.target);
    if (clickedIndex === -1) return;
    else if (clickedIndex === player.currentPlaylist) return;
    console.log("asd");

    for (const child of playlistMenuUIObjects.playlistList.children) {
      child.classList.remove("activePlaylist");
    }
    playlistMenuUIObjects.playlistList.children[clickedIndex].classList.add(
      "activePlaylist"
    );

    player.currentPlaylist = clickedIndex;
    player.generatePlaylist(player.currentPlaylist);
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
  // likeTrack: () => {
  //   let track = player.tracks[player.currentTrackIndex];
  //   if (track.isLiked) {
  //     console.log(track.isLiked);

  //     track.likes--;
  //     UIObjects.thumbsUp.classList.remove("bi-hand-thumbs-up-fill");
  //     UIObjects.thumbsUp.classList.add("bi-hand-thumbs-up");
  //     UIObjects.thumbsDown.classList.remove("bi-hand-thumbs-up-fill");

  //   } else {
  //     track.likes++;
  //     UIObjects.thumbsUp.classList.remove("bi-hand-thumbs-up");
  //     UIObjects.thumbsUp.classList.add("bi-hand-thumbs-up-fill");
  //   }
  //   track.isLiked = !track.isLiked;
  //   UIObjects.likesCount.textContent = track.likes;
  // },
  // dislikeTrack: () => {
  //   let track = player.tracks[player.currentTrackIndex];
  //   console.log(track.isLiked);
  //   if (track.isLiked) {
  //     console.log("dislike");
  //     track.dislikes--;
  //     UIObjects.thumbsDown.classList.remove("bi-hand-thumbs-down-fill");
  //     UIObjects.thumbsDown.classList.add("bi-hand-thumbs-down");
  //   } else {
  //     track.dislikes++;
  //     UIObjects.thumbsDown.classList.remove("bi-hand-thumbs-down");
  //     UIObjects.thumbsDown.classList.add("bi-hand-thumbs-down-fill");
  //   }
  //   track.isLiked = !track.isLiked;
  //   UIObjects.dislikesCount.textContent = track.likes;
  // },
  // toggleLikeDislike: (e) => {
  //   const track = player.tracks[player.currentTrackIndex];
  //   const clickedItemId = e.target.id;
  //   console.log(clickedItemId);
  //   if (clickedItemId === "thumbsUp") {
  //     player.likeTrack();
  //   } else if (clickedItemId === "thumbsDown") {
  //     player.dislikeTrack();
  //   }
  // },
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
// UIObjects.thumbsUp.addEventListener("click", player.toggleLikeDislike);
// UIObjects.thumbsDown.addEventListener("click", player.toggleLikeDislike);
playlistMenuUIObjects.playlistList.addEventListener(
  "click",
  player.clickPlaylistMenu
);
playlistMenuUIObjects.playlistList.children[0].classList.add("activePlaylist");

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
