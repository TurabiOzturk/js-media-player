document.querySelector("#app").innerHTML = `

<div class="playlists">
  <ul id="playlistList"></ul>
</div>
<div class="player">
  <div class="details">
    <div class="now-playing">PLAYING x OF y</div>
    <div class="track-art-container">
    <img class="target-image" id="track-art" src="" crossorigin="anonymous">  
    </div>
    <div class="track-name">Track Name</div>
    <div class="track-artist">Track Artist</div>
  </div>
  <div class="buttons">
    <div class="prev-track">
      <i class="fa fa-step-backward fa-2x"></i>
    </div>
    <div class="playpause-track">
      <i class="fa fa-play-circle fa-2x"></i>
    </div>
    <div class="next-track">
      <i class="fa fa-step-forward fa-2x"></i>
    </div>
  </div>
  <div class="slider_container">
    <div class="current-time">00:00</div>
    <input
      type="range"
      min="0"
      max="100"
      value="0"
      class="seek_slider"
    />
    <div class="total-duration">00:00</div>
  </div>
  <div class="slider_container">
  <!-- Following i elements change when hovered over
   search for :hover::before in style.css if you want to
   make any changes -->
    <i class="bi bi-hand-thumbs-up"></i>
    <i class="bi bi-hand-thumbs-down"></i>
    <i id="volume-mute-icon" class="fa fa-volume-down"></i>
    <input
      type="range"
      min="0"f
      max="100"
      value="99"
      class="volume_slider"
    />
    <i class="fa fa-volume-up"></i>
    
    <div class="shuffle-button">
      <i class="fas fa-random shuffle-icon"></i>
  </div>
  
  <div class="repeat-button">
  <i id="repeat-icon" class="bi bi-repeat"></i>
  </div>
    <!-- <i class="bi bi-hand-thumbs-up-fill"></i>
    <i class="bi bi-hand-thumbs-down-fill"></i> -->
  </div>
  </div>
  <div class="container mt-5">
  <div class="row">
    <div class="col" id="playlist-scroll">
      <ul id="track-list">
        <!-- dynamically created in JS -->
      </ul>
    </div>
  </div>
  </div>

`;
