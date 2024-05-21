document.querySelector('#app').innerHTML = `


<div class="player">
<div class="details">
  <div class="now-playing">PLAYING x OF y</div>
  <div class="track-art"></div>
  <div class="track-name">Track Name</div>
  <div class="track-artist">Track Artist</div>
</div>
<div class="buttons">
  <div class="prev-track">
    <i class="fa fa-step-backward fa-2x"></i>
  </div>
  <div class="playpause-track">
    <i class="fa fa-play-circle fa-5x"></i>
  </div>
  <div class="next-track">
    <i class="fa fa-step-forward fa-2x"></i>
  </div>
</div>
<div class="slider_container">
  <div class="current-time">00:00</div>
  <input
    type="range"
    min="1"
    max="100"
    value="0"
    class="seek_slider"
  />
  <div class="total-duration">00:00</div>
</div>
<div class="slider_container">
  <i class="fa fa-volume-down"></i>
  <input
    type="range"
    min="1"
    max="100"
    value="99"
    class="volume_slider"
  />
  <i class="fa fa-volume-up"></i>
  <!-- Following i elements change when hovered over
 search for :hover::before in style.css if you want to
 make any changes -->
  <i class="bi bi-hand-thumbs-up"></i>
  <i class="bi bi-hand-thumbs-down"></i>
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
`