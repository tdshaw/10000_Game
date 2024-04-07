// Declare variables
let song_names = ["All That", "Badass", "The Jazz Piano", "Funky Suspense", "The Lounge", "Straight"];

// Add songs to drop down
for(let i = 0; i < num_songs; i++)
    document.getElementById("song_change").innerHTML += `<option value=${i}>${song_names[i]}</option>`;

// Set the current drop down value
const mySel = document.getElementById("song_change"); // Get address of select 
mySel.value = current_song;

// Check for changes
mySel.addEventListener("change", function(){
    localStorage.setItem("current_song", this.value);
    current_song = localStorage.getItem("current_song"); // Get current value
    mySel.value = current_song; // Set the dropdown 
    var current_audio = document.getElementById("current_audio");

    if(current_audio != null)
    {
        current_audio.src = src + songs_src[current_song] + ".mp3";
        setCurTime(0, current_audio);
    }
});

// OnClick Event for button -> Removes music or adds it depending on mute value
function toggleMusic() {
    if(mute == "false") // Remove music
    {   
        const current_audio = document.getElementById("current_audio");
        current_audio.remove();

        mute = "true";
    }
    else if(mute == "true") // Add current song
    {
        music.innerHTML += "<audio id='current_audio' autoplay ontimeupdate='updateTrackTime(this);'></audio>";

        var current_audio = document.getElementById("current_audio");
        current_audio.src = src + songs_src[current_song] + ".mp3"; 
        current_audio.type = "audio/mp3";
        setCurTime(0, current_audio);

        mute = "false";
    }

    localStorage.setItem("mute", mute); // Set new storage value
}

// Record current track time
function updateTrackTime(track){
    var currTime = Math.floor(track.currentTime).toString();

    localStorage.setItem("current_time", currTime);
}
