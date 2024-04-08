let num_players = localStorage.getItem("num_players"); // Get num_players from storage

// Set default
if(num_players == null)
{
    localStorage.setItem("num_players", 2);
    num_players = 2;
}

// Loop through num_players and add text boxes
for(i = 0; i < num_players; i++){
    document.getElementById("names").innerHTML += "<input id='' type='text'><br>";
}

/******************************************************
 * @brief Get the names for each player
******************************************************/
function getPlayerNames()
{
    var input_boxes = document.getElementsByTagName("input");
    var player_names = [];

    for(i = 0; i < num_players; i++)
    {
        if(input_boxes[i].value != "")
            player_names.push(input_boxes[i].value);
    }

    localStorage.setItem("player_names", JSON.stringify(player_names));

    if(player_names.length == num_players)
        location.href="";
    else
        alert("Please enter a name for each player.");
}
