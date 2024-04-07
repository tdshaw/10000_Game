let num_players = localStorage.getItem("num_players"); // Get num_players from storage

// Set default
if(num_players == null)
{
    localStorage.setItem("num_players", 2);
    num_players = 2;
}

// Loop through num_players and add text boxes
for(i = 0; i < num_players; i++){
    document.getElementById("names").innerHTML += "<input type='text'><br>";
}