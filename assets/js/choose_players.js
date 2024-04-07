let current_value = localStorage.getItem("num_players"); // Get current value

if(current_value == null) // Check if local storage was cleared
    localStorage.setItem("num_players", 2);

const mySel = document.getElementById("num_players"); // Get address of select 

// Check for changes
mySel.addEventListener("change", function(){
    localStorage.setItem("num_players", this.value);
});

let val = localStorage.getItem("num_players"); // Get current value

if (val) mySel.value=val; // Set the dropdown 