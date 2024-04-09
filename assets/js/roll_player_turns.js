let player_names = JSON.parse(localStorage.getItem("player_names"));
let num_players = Number(localStorage.getItem("num_players"));
let clicked = Boolean(localStorage.getItem("clicked")); // Flag for Roll button clicked or not
let index = Number(localStorage.getItem("index")); // Index of player to be rolled next
let rolls = JSON.parse(localStorage.getItem("rolls")); // Array of rolls for each player
let roll_num = Number(localStorage.getItem("roll_num"));
let roll_check = Boolean(localStorage.getItem("roll_check")); // Flag for checking if players have all rolled initially
let dupe_check = Boolean(localStorage.getItem("dupe_check")); // Flag for checking duplicates
let reroll_check = Boolean(localStorage.getItem("reroll_check")); // Flag for checking if players have rerolled
let indices = JSON.parse(localStorage.getItem("indices")); // 2D array for player indices depending on roll #

let players = []; // Array of Player objects

const dice = document.querySelector('.dice');
const rollBtn = document.querySelector('.roll');

// localStorage.removeItem("index");
// localStorage.removeItem("rolls");
// localStorage.removeItem("indices");
// localStorage.removeItem("roll_num");
// localStorage.removeItem("clicked");
// localStorage.removeItem("roll_check");
// localStorage.removeItem("dupe_check");
// localStorage.removeItem("reroll_check");

// Set default values
if(clicked == null)
    clicked = false;
if(rolls == null)
    rolls = [];
if(indices == null)
    indices = [[], [], [], [], [], []];
if(roll_num == 0)
    roll_num = 6;
if(roll_check == null)
    roll_check = false;
if(dupe_check == null)
    dupe_check = false;
if(reroll_check == null)
    reroll_check = false;

console.log("Beginning", players, rolls, index, num_players, roll_num, clicked, roll_check, dupe_check, reroll_check);

const randomDice = () => {

    rollBtn.removeEventListener('click', randomDice);

    const random = Math.floor(Math.random() * 6 + 1);

    rolls.push(random);
    index++;

    rollDice(random);
}

const rollDice = random => {

    dice.style.animation = 'rolling 3s';

    setTimeout(() => {

        switch (random) {
            case 1:
                dice.style.transform = 'rotateX(0deg) rotateY(0deg)';
                break;

            case 6:
                dice.style.transform = 'rotateX(180deg) rotateY(0deg)';
                break;

            case 2:
                dice.style.transform = 'rotateX(-90deg) rotateY(0deg)';
                break;

            case 5:
                dice.style.transform = 'rotateX(90deg) rotateY(0deg)';
                break;

            case 3:
                dice.style.transform = 'rotateX(0deg) rotateY(-90deg)';
                break;

            case 4:
                dice.style.transform = 'rotateX(180deg) rotateY(-90deg)';
                break;

            default:
                break;
        }

        dice.style.animation = 'none';

        let rolled = document.getElementById("rolled");
        rolled.innerHTML += `<h2 id="${player_names[index - 1]}">${player_names[index - 1]} rolled: ${random}</h2>`;

    }, 3050);

    setTimeout(() => {

        localStorage.setItem("index", index);

        localStorage.setItem("rolls", JSON.stringify(rolls));

        removePlayerRoll();

        location.reload();
    }, 7050);
}

localStorage.setItem("turn", 0); // Start turn order at 0

// Add each player to the array
for(i = 0; i < num_players; i++)
{
    players.push(new Player());

    players[i].setName(player_names[i]);
}

if(!roll_check && index < num_players)
    outputPlayerRoll(players[index].name);

if(!dupe_check && index >= num_players)
{
    localStorage.setItem("roll_check", true);
    getDuplicates();
    localStorage.setItem("dupe_check", true);
    localStorage.setItem("indices", JSON.stringify(indices));
    location.reload();
}

console.log(indices);

if(roll_check && dupe_check && !reroll_check && roll_num >= 1 && indices[roll_num - 1].length > 1)
{
    let rolling = document.getElementById("rolling");
    rolling.innerHTML += 
    `<h2 id="player_roll">
    ${indices[roll_num - 1].length} players rolled a ${roll_num - 1}.
        <br>Each player must roll again.
    </h2>`;
    
    setTimeout(() => {
        let player_roll = document.getElementById("player_roll");
        player_roll.remove();
        localStorage.setItem("index", 0);
        localStorage.setItem("reroll_check", true);
        location.reload();
    }, 6050);
}
else if(roll_num >= 1 && roll_check && dupe_check && !reroll_check && indices[roll_num - 1].length <= 1)
{
    roll_num -= 1;
    if(roll_num == 0)
        roll_num = -1;
    localStorage.setItem("roll_num", roll_num);
    location.reload();
}

if(reroll_check && roll_num >= 1 && index < indices[roll_num - 1].length)
    outputPlayerRoll(players[index].name);

// getPlayerTurns(players, num_players); // Get turn order for each player

// sortPlayers(players, 0, num_players - 1);

// localStorage.setItem("players", JSON.stringify(players));

/*************************************************************************
 * @brief Outputs an h2 to div w/ id="player_roll" for each player's roll
 * @param player_name -> The name of the player currently rolling
*************************************************************************/
function outputPlayerRoll(player_name) 
{
    let rolling = document.getElementById("rolling");
    rolling.innerHTML += `<h2 id="player_roll">${player_name} is rolling:</h2>`;

    rollBtn.addEventListener('click', randomDice);
}

/***************************************************************************
 * @brief Removes an h2 from div w/ id="player_roll" for each player's roll
***************************************************************************/
function removePlayerRoll() 
{
    let player_roll = document.getElementById("player_roll");
    player_roll.remove();
}

/****************************************************************************************
 * @brief Gets a 2d-array of indices for each player's roll (checking for duplicates)
****************************************************************************************/
function getDuplicates()
{
    var num_instances; // # of duplicate rolls 

    // Starting with 6 -> 1 check for duplicate rolls
    for(let i = 6; i > 0; i--)
    {
        num_instances = 0;

        // Check all player rolls for duplicates
        for(j = 0; j < num_players; j++)
        {
            if(!players[j].getFlag() && rolls[j] == i) // Check if player has a turn order yet and the roll is duplicate
               indices[i - 1][num_instances++] = j;
        }
    }
}

/************************************************************************************************************************/
/*****************************************************
 * @brief Get the Player Turns object for each player
 * @param players -> See class def for Player
 * @param num_players -> # of players in the game
*****************************************************/
function getPlayerTurns(players, num_players)
{
    // Declare initial variables
    var rolls = []; // array for each player's roll
    var indices = []; // array for index of each player
    var num_instances; // # of duplicate rolls 

    rollAllPlayers(rolls, num_players); // Each player rolls once initially

    // Starting with 6 -> 1 check for duplicate rolls
    for(let i = 6; i > 0; i--)
    {
        num_instances = 0;
        let turn = Number(localStorage.getItem("turn")); // Turn order

        // Check all player rolls for duplicates
        for(j = 0; j < num_players; j++)
        {
            if(!players[j].getFlag() && rolls[j] == i) // Check if player has a turn order yet and the roll is duplicate
               indices[num_instances++] = j;
        }

        getPlayerTurnsRecursive(players, indices, num_instances, turn); // For all duplicates within 6 -> 1 run a recursive loop
    }
}

/*****************************************************
 * @brief Get the Player Turns object for each player
 * @param players -> See class def for Player
 * @param indices -> Index of each player in players
 * @param num_players -> # of players in the game
 * @param turn -> Current turn being processed
*****************************************************/
function getPlayerTurnsRecursive(players, indices, num_players, turn)
{
    if(num_players == 0) // Base Case: No duplicate rolls
        return;
    else if(num_players == 1) // Base Case: 1 duplicate roll, set turn order for that player
    {
        players[indices[0]].setTurn(turn++);
        localStorage.setItem("turn", turn); // Store new turn order
    }
    else // Case: Duplicate rolls, re-roll all players for that number
    {
        // Declare initial variables
        var rolls = [];         // Array for each player's roll
        var dupe_indices = [];  // Array for duplicate indices
        var num_instances; // # of duplicate rolls

        rollAllPlayers(rolls, num_players); // All players roll again

        // Check for duplicates from 6 -> 1 again
        for(let i = 6; i > 0; i--)
        {
            num_instances = 0;
            let turn = Number(localStorage.getItem("turn")); // Turn order

            // Checking only the previous duplicate players for more dupes
            for(j = 0; j < num_players; j++)
            {
                if(rolls[j] == i) // If it matches, store it
                    dupe_indices[num_instances++] = indices[j];
            }

            getPlayerTurnsRecursive(players, dupe_indices, num_instances, turn); // Run recursive loop again for new dupes
        }
    }
}

/************************************************************************************************************************/

/**********************************************
 * @brief Swaps two players
 * @param players -> See class def for Player
 * @param p1 -> Index for first player
 * @param p2 -> Index for second player
**********************************************/
function swapPlayers(players, p1, p2)
{
    let temp = players[p1];
    players[p1] = players[p2];
    players[p2] = temp;
}

/********************************************************************************
 * @brief Partition function for quicksorting the array of players by turn order
 * @param players -> See class def for Player
 * @param start -> The start index
 * @param end -> The end index
 * @return int 
********************************************************************************/
function partition(players, start, end)
{
    // Declare initial variables
    let pivot = Math.floor((start + end) / 2);  // Calculate pivot point
    let swap_index = start;         // Get the initial swap index

    swapPlayers(players, pivot, end); // Swap pivot and end

    pivot = end; // Set pivot to the end of the array

    // Starting from the beginning, find smaller values and swap
    for(let i = start; i < end; i++)
    {
        if(players[i].checkLessThanEqual(players[pivot])) // If smaller -> swap
        {
            swapPlayers(players, i, swap_index);

            swap_index++;
        }
    }

    swapPlayers(players, swap_index, pivot); // Swap pivot with new swap index

    return swap_index; // Return new swap index
}

/*********************************************************
 * @brief Quicksort by turn order for array of players
 * @param players -> See class def for Player
 * @param start -> Start index
 * @param end -> End index
*********************************************************/
function sortPlayers(players, start, end)
{
    if(start < end) // Recursive loop until start >= end
    {
        let pivot = partition(players, start, end); // Get the pivot

        sortPlayers(players, start, pivot - 1); // Run quicksort for left partition

        sortPlayers(players, pivot + 1, end); // Run quicksort for right partition
    }
}
