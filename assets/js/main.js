/*
TODO:
- Change variable names from snake_case to camelCase
- Add rating for songs 1-5 > need to pull songs from JSON first
- Log how many times each song have been played
- Add shuffle option
- Add repeat option
*/

let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");
let now_playing = document.querySelector(".now-playing");

//experimental

const trackList = document.getElementById("track-list");
const listItems = trackList.querySelectorAll("li");

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

/*
TODO:
- show playlist on the screen ✅
- Make list scrollable ✅
- Change the current track when a song from list getting clicked ✅
*/
//create an array of track objects
let track_list = [
  {
    name: "Dang Feels",
    artist: "Turabi Ozturk",
    image:
      "https://plus.unsplash.com/premium_photo-1681955753855-9d6bcde2d2a5?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    path: "tracks/dang_feels.mp3",
    rating: 0,
  },
  {
    name: "Deneme",
    artist: "Turabi Ozturk",
    image:
      "https://images.unsplash.com/photo-1713208176490-3ac46ac160a8?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    path: "tracks/deneme.mp3",
    rating: 0,
  },
  {
    name: "Existential Dread",
    artist: "Turabi Ozturk",
    image:
      "https://images.unsplash.com/photo-1711126978286-16424ccdd787?q=80&w=930&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    path: "tracks/existential_dread.mp3",
    rating: 0,
  },
];

function random_bg_color() {
  /*
        TODO: 
        - change function name from random_bg_color() to setBgColorByPicture()
        - Parse the dominant color of the pic
        - set dominant color as background color
        */

  // Get a number between 64 to 256 (for getting lighter colors)
  let red = Math.floor(Math.random() * 256) + 64;
  let green = Math.floor(Math.random() * 256) + 64;
  let blue = Math.floor(Math.random() * 256) + 64;

  // Construct a color withe the given values
  let bgColor = "rgb(" + red + "," + green + "," + blue + ")";

  // Set the background to that color
  document.body.style.background = bgColor;
}

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

function loadTrack(track_index) {
  //listItems.forEach((listItem) => listItem.classList.remove("active"));
  clearInterval(updateTimer);
  resetValues();
  generatePlaylist();

  curr_track.src = track_list[track_index].path;
  curr_track.load();

  trackList.children[track_index].classList.add("active");
  trackList.children[nowPlaying].classList.remove("active");
  nowPlaying = track_index;

  //console.log("now playing " + nowPlaying);

  track_art.style.backgroundImage =
    "url(" + track_list[track_index].image + ")";
  track_name.textContent = track_list[track_index].name;
  track_artist.textContent = track_list[track_index].artist;
  now_playing.textContent =
    "PLAYING " + (track_index + 1) + " OF " + track_list.length;

  updateTimer = setInterval(seekUpdate, 1000);
  curr_track.addEventListener("ended", nextTrack);
  random_bg_color();
}

function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

// Load the first track in the tracklist
loadTrack(track_index);

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

function playFromList(event) {
  // Check if the clicked element is an <li> element
  if (event.target.tagName.toLowerCase() === "li") {
    // Get the index of the clicked list item
    let clickedIndex = Array.from(trackList.children).indexOf(event.target);

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

// Add the event listener to the trackList element
trackList.addEventListener("click", playFromList);

function prevTrack() {
  if (track_index > 0) track_index -= 1;
  else track_index = track_list.length;
  //   trackList.children[track_index].classList.add('active');
  //   trackList.children[nowPlaying].classList.remove('active');
  loadTrack(track_index);
  playTrack();
}

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
