// Get stored values
let current_song = localStorage.getItem("current_song");
let mute = localStorage.getItem("mute");
let current_time = localStorage.getItem("current_time");

// Declare variables
let src = "https://Github-Portfolio.s3.us-west-000.backblazeb2.com/audio/";
let songs_src = ["allthat", "badass", "thejazzpiano", "funkysuspense", "thelounge", "straight"];
let music = document.getElementById("music");
const num_songs = 6;

// Check for default values
if(current_song == null)
    current_song = Math.floor(Math.random() * num_songs) % num_songs;

if(mute == "null")
    mute = "false";

if(current_time == "null")
    current_time = 0;

// Set storage values
localStorage.setItem("current_song", current_song);
localStorage.setItem("mute", mute);

// User has not toggled music OFF -> Play audio
if(mute == "false")
{
    music.innerHTML += "<audio id='current_audio' autoplay ontimeupdate='updateTrackTime(this);'></audio>";

    var current_audio = document.getElementById("current_audio");
    current_audio.src = src + songs_src[current_song] + ".mp3"; 
    current_audio.type = "audio/mp3";
    setCurTime(current_time, current_audio);
}

// Sets the current time of the playing song
function setCurTime(time, current_audio) { 
    localStorage.setItem("current_time", time); 
    current_audio.currentTime = time;
} 

// Keeps track of current track time
function updateTrackTime(track){
    var currTime = Math.floor(track.currentTime).toString();

    localStorage.setItem("current_time", currTime);
}

// Plays next song on end
$("#current_audio").bind("ended", function(){
    current_song = (current_song + 1) % num_songs;
    current_audio.src = src + songs_src[current_song] + ".mp3";     
    localStorage.setItem("current_song", current_song); 
});
