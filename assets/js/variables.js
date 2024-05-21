export const track_art = document.querySelector(".track-art");
export const track_name = document.querySelector(".track-name");
export const track_artist = document.querySelector(".track-artist");
export const now_playing = document.querySelector(".now-playing");

//experimental

export const trackList = document.getElementById("track-list");
export let isPlayListGenerated = false;
export let nowPlaying;

export const playpause_btn = document.querySelector(".playpause-track");
export const next_btn = document.querySelector(".next-track");
export const prev_btn = document.querySelector(".prev-track");
export const seek_slider = document.querySelector(".seek_slider");
export const volume_slider = document.querySelector(".volume_slider");
export const curr_time = document.querySelector(".current-time");
export const total_duration = document.querySelector(".total-duration");


export let track_index = 0;
export let isPlaying = false;
export let updateTimer;

// Create new audio element
export const curr_track = document.createElement("audio");