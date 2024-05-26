let track_art = document.getElementById("track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");
let now_playing = document.querySelector(".now-playing");

//experimental

const track_list = document.getElementById("track-list");


//experimental

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");



// Create new audio element
let curr_track = document.createElement("audio");

export const selector = {
    track_art,
    track_name,
    track_artist,
    now_playing,
    track_list,
    playpause_btn,
    next_btn,
    prev_btn,
    seek_slider,
    volume_slider,
    curr_time,
    total_duration,
    curr_track,
};