import ColorThief from "../../node_modules/colorthief/dist/color-thief.mjs";

let track_art = document.getElementById("track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");
let now_playing = document.querySelector(".now-playing");

//experimental

const trackList = document.getElementById("track-list");
//const listItems = trackList.querySelectorAll("li");

let isPlayListGenerated = false;
let nowPlaying;
//experimental

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

let track_index = 0;
let isPlaying = false;
let updateTimer;

// Create new audio element
let curr_track = document.createElement("audio");

//create an array of track objects
let track_list = [
  {
    name: "Dang Feels",
    artist: "Turabi Ozturk",
    image: "assets/tracks/track-art/track_art_dang_feels.avif",
    path: "assets/tracks/track-file/dang_feels.mp3",
    rating: 0,
  },
  {
    name: "Deneme",
    artist: "Turabi Ozturk",
    image: "assets/tracks/track-art/track_art_deneme.avif",
    path: "assets/tracks/track-file/deneme.mp3",
    rating: 0,
  },
  {
    name: "Existential Dread",
    image: "assets/tracks/track-art/track_art_existential_dread.avif",
    artist: "Turabi Ozturk",
    path: "assets/tracks/track-file/existential_dread.mp3",
    rating: 0,
  },
];

function generatePlaylist() {
  if (isPlayListGenerated !== true) {
    for (let i = 0; i < track_list.length; i++) {
      nowPlaying = i;
      const trackItem = track_list[i];
      const listItem = document.createElement("li");
      const listDiv = document.createElement("div");
      listItem.classList.add("track-item");
      //listItem.setAttribute("onclick", "playFromList()");

      const trackTitle = document.createElement("h3");
      trackTitle.textContent = trackItem.name;
      const trackArtist = document.createElement("p");
      trackArtist.textContent = `by ${trackItem.artist}`;
      const trackImage = document.createElement("img");
      trackImage.src = trackItem.image;

      // Append elements to the list item
      listItem.appendChild(trackImage);
      listItem.appendChild(listDiv);
      listDiv.appendChild(trackTitle);
      listDiv.appendChild(trackArtist);

      // Append the list item to the track list element
      trackList.appendChild(listItem);
      isPlayListGenerated = true;
    }
  } else {
    //console.log("There is already a tracklist of " +track_list.length+ " songs!");
  }
}

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

let colorArray;

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
function loadTrack(track_index) {
  clearInterval(updateTimer);
  resetValues();
  generatePlaylist();

  curr_track.src = track_list[track_index].path;
  curr_track.load();

  trackList.children[track_index].classList.add("active");
  trackList.children[nowPlaying].classList.remove("active");
  nowPlaying = track_index;

  track_art.src = `${track_list[track_index].image}`;
  track_name.textContent = track_list[track_index].name;
  track_artist.textContent = track_list[track_index].artist;
  now_playing.textContent =
    "PLAYING " + (track_index + 1) + " OF " + track_list.length;

  updateTimer = setInterval(seekUpdate, 1000);
  curr_track.addEventListener("ended", () => {
    if (isShuffle) {
      console.log("shuffle on");
      const randomSong = Math.floor(Math.random() * track_list.length -1);
      loadTrack(randomSong);
    } else {
      console.log("shuffle off");
      nextTrack();
    }
  });

  if (track_art.complete) {
    colorArray = colorThief.getPalette(track_art);
  } else {
    track_art.addEventListener("load", function () {
      colorArray = colorThief.getPalette(track_art);
      generateGradientString(colorArray);
      const gradient = generateGradientString(colorArray);
      document.body.style.background = gradient;
    });
  }
}

function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

function playpauseTrack() {
  if (!isPlaying) playTrack();
  else pauseTrack();
}

function playTrack() {
  curr_track.play();
  isPlaying = true;
  playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

function nextTrack() {
  if (track_index < track_list.length - 1) {
    track_index += 1;
  } else {
    track_index = 0;
  }
  //   trackList.children[track_index].classList.add('active');
  //   trackList.children[nowPlaying].classList.remove('active');

  loadTrack(track_index);
  playTrack();
}
function prevTrack() {
  if (track_index > 0) track_index -= 1;
  else track_index = track_list.length;
  loadTrack(track_index);
  playTrack();
}
function playFromList(event) {
  // Check if the clicked element is an <li> element
  if (event.target.tagName.toLowerCase() === "li") {
    // Get the index of the clicked list item
    let clickedIndex = Array.from(trackList.children).indexOf(event.target);
    if (clickedIndex == track_index) {
      return false;
    } else {
      // Update the track_index and load the new track
      track_index = clickedIndex;
      loadTrack(track_index);
      playTrack();
      // Add the 'active' class to the clicked list item
    // and remove it from the previously active item
    trackList.querySelector(".active")?.classList.remove("active");
    //FIXME: adding class is already handled in loadTrack
    //why does it not work when I comment out the below line?
    event.target.classList.add("active");
    }

    
  }
}

// Add the event listener to the trackList element
trackList.addEventListener("click", playFromList);

function seekTo() {
  let seekto = curr_track.duration * (seek_slider.value / 100);
  curr_track.currentTime = seekto;
}

function setVolume() {
  curr_track.volume = volume_slider.value / 100;
}

function seekUpdate() {
  let seekPosition = 0;

  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);

    seek_slider.value = seekPosition;

    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(
      curr_track.currentTime - currentMinutes * 60
    );
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(
      curr_track.duration - durationMinutes * 60
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

    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}

document
  .querySelector(".playpause-track")
  .addEventListener("click", playpauseTrack);
document.querySelector(".next-track").addEventListener("click", nextTrack);
document.querySelector(".prev-track").addEventListener("click", prevTrack);
document.querySelector(".seek_slider").addEventListener("change", seekTo);
document.querySelector(".volume_slider").addEventListener("change", setVolume);
trackList.addEventListener("click", playFromList);
loadTrack(track_index);

export { track_art as trackArt };
