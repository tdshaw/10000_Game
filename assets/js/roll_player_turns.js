let player_names = JSON.parse(localStorage.getItem("player_names"));
let num_players = Number(localStorage.getItem("num_players"));
let players = []; // Array of Player objects
let clicked = false; // Flag for Roll button clicked or not

const dice = document.querySelector('.dice');
const rollBtn = document.querySelector('.roll');

const randomDice = () => {

    const random = Math.floor(Math.random() * 10);

    if (random >= 1 && random <= 6) {
        rollDice(random);
    }
    else {
        randomDice();
    }
}

const rollDice = random => {

    dice.style.animation = 'rolling 4s';

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
                dice.style.transform = 'rotateX(0deg) rotateY(90deg)';
                break;

            case 4:
                dice.style.transform = 'rotateX(0deg) rotateY(-90deg)';
                break;

            default:
                break;
        }

        dice.style.animation = 'none';

    }, 4050);

}

localStorage.setItem("turn", 0); // Start turn order at 0

// Add each player to the array
for(i = 0; i < num_players; i++)
{
    players.push(new Player());

    players[i].setName(player_names[i]);
}

rollBtn.addEventListener('click', randomDice);

getPlayerTurns(players, num_players); // Get turn order for each player

sortPlayers(players, 0, num_players - 1);

console.log(players);

localStorage.setItem("players", JSON.stringify(players));

/**************************************************************
 * @brief Generates a random number between 1-6 for dice rolls
**************************************************************/
function determineRoll() {
    return Math.floor(Math.random() * (6) + 1); // Return a random number between 1-6
}

/*****************************************************************************
 * @brief Function rolls a single dice roll for a specified number of players
 * @param rolls -> The side rolled for each dice
 * @param num_players -> # of players in the game
******************************************************************************/
function rollAllPlayers(rolls, num_players)
{
    for(let i = 0; i < num_players; i++)
    {
        rolls[i] = determineRoll();
    }
}

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
