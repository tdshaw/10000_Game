let num_players = localStorage.getItem("num_players"); // Get num_players from storage
let player_names = JSON.parse(localStorage.getItem("player_names"));

// Set default
if(num_players == null)
{
    localStorage.setItem("num_players", 2);
    num_players = 2;
}

// Loop through num_players and add text boxes
for(i = 0; i < num_players; i++){
    if(player_names != null && player_names[i] != "" && player_names[i] != null)
        document.getElementById("names").innerHTML += `<input type='text' value='${player_names[i]}'><br>`;
    else
        document.getElementById("names").innerHTML += "<input type='text'><br>";
}

/******************************************************
 * @brief Get the names for each player
******************************************************/
function getPlayerNames()
{
    var input_boxes = document.getElementsByTagName("input");
    player_names = [];

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
