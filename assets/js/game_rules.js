/*****************************************************************************************************************************************
 * 10,000 Dice Game Rules: (2+ players)
 
 * To start the game:
    * Each player rolls a die to determine who rolls first

 * Playing the game:
    * Player rolls 6 dice
        * Check for single 1s and 5s, three or more-of-a-kinds, or straights
            * single 1 = 100pts, single 5 = 50pts
            * three-of-a-kind = num*100pts (1s are exception = 1000pts) doubling with 4-of-a-kind and so on
            * straight = 1200pts, three pairs = 600pts
        * Set aside scoring dice
        * End turn by adding pts or a roll that scored 0 pts
            * To earn continuing pts, the player MUST roll 1000pts on one round
            * If all dice have been rolled on a turn and they score pts for the player, the player MUST roll all 6 at least one more time
* To win the game:
    * First player to score 10,000pts wins. Each other player gets one extra attempt to beat that player's score if possible
        * Keep a track of what all players score
******************************************************************************************************************************************/

// Declare global variables
const CAPACITY = 10;

/********************* CLASS DEFINITIONS *********************/

/*******************************************************
 * @brief Player class
    * Name of player
    * Turn order for player
    * Points player has
    * Flag for turn order (or anything I need it for) 
    * setName, getName
    * setFlag, getFlag
    * setTurn, getTurn
    * setPoints, addPoints, getPoints
    * operator=, operator<, operator<=
*******************************************************/
class Player
{
    constructor() {
        this.name = "";
        this.turn = -1;
        this.points = 0;
        this.flag = false;
    }

    setName(input) { this.name = input; };
    getName() { return this.name; };
    setFlag(input) { this.flag = input; };
    getFlag() { return this.flag; };
    setTurn(input) { this.turn = input; this.setFlag(true); };
    getTurn() { return this.turn; };
    setPoints(input) { this.points = input; };
    addPoints(input) { this.points += input; };
    getPoints() { return this.points; };
    checkLessThan(p) { return (this.turn < p.turn) ? true:false;};
    checkLessThanEqual(p) { return (this.turn <= p.turn) ? true:false; };

    /*******************************************************
     * @brief Copy constructor for players
     * @param temp -> Copies values for p temporarily
     * @param p -> Copies values from player
    *******************************************************/
    copyPlayerValues(temp, p)
    { 
        temp.name = p.name; 
        temp.turn = p.turn; 
        temp.points = p.points;

        p.name = this.name;
        p.turn = this.turn;
        p.points = this.points;

        this.name = temp.name;
        this.turn = temp.turn;
        this.points = temp.points; 
    }
}

/*******************************************************
 * @brief Class for the dice being rolled
    * roll -> # determined by roll
    * flag -> indicates die has been taken out of play
*******************************************************/
class Dice
{
    constructor() 
    {
        this.roll;
        this.flag = false;
    }
}

/*******************************************************
 * @brief Class for all possibilities for each dice
    * dupes -> # of duplicate rolls
    * points -> # of possible points for roll
    * flag -> indicates points are possible for roll  
*******************************************************/
class PossibleRolls
{
    constructor() 
    {
        this.dupes = 0;
        this.points = 0;
        this.flag = false;
    }
}

/********************* GLOBAL FUNCTIONS *********************/

/**************************************************************
 * @brief Generates a random number between 1-6 for dice rolls
**************************************************************/
function determineRoll() {
    return Math.random() * (6 - 1) + 1; // Return a random number between 1-6
}

/**********************************************************************
 * @brief Set the flags for dice that have been chosen to be set aside
 * @param dice_rolls -> An array for each dice -> see Dice class def
 * @param input -> Current dice side for roll
 * @param num -> Corresponds to # of dice matching input
**********************************************************************/
function setRollFlags(dice_rolls, input, num)
{
    var count = num; // Set count to number chosen

    // Loop through all dice and set flags that match
    for(var i = 0; count > 0 && i < 6; i++)
    {
        // Check that flag is not set and roll matches
        if(!dice_rolls[i].flag && dice_rolls[i].roll == input)
        {
            count--; // Decrease count
            dice_rolls[i].flag = true; // Set flag
        }
    }
}

/***********************************************************************
 * @brief Determine possible points value for input roll # and quantity
 * @param i -> Dice side being checked for points (add 1 for actual)
 * @param count -> # of dice with that side for current roll
 * @return int 
***********************************************************************/
function determinePossiblePoints(i, count)
{
    var points = 0; // Set initial points value

    if(i == 0) // 1s
    {
        if(count < 3) // 1 = 100pts, 2 = 200pts
            points = count*100;
        else if(count == 3) // 3 = 1000pts
            points = 1000;
        else if(count > 3 && count < 6) // 4 = 2000pts, 5 = 4000pts
            points = 2000*(count - 3);
        else // 6 = 8000pts
            points = 8000;
    }
    if(i == 1) // 2s
    {
        if(count > 2 && count < 5) // 3 = 200pts, 4 = 400pts
            points = 200*(count - 2);
        else if(count == 5) // 5 = 800pts
            points = 800;
        else if(count == 6) // 6 = 1600pts
            points = 1600;
    }
    if(i == 2) // 3s
    {
        if(count > 2 && count < 5) // 3 = 300pts, 4 = 600pts
            points = 300*(count - 2);
        if(count == 5) // 5 = 1200pts
            points = 1200;
        else if(count == 6) // 6 = 2400pts
            points = 2400;
    }
    if(i == 3) // 4s
    {
        if(count > 2 && count < 5) // 3 = 400pts, 4 = 800pts
            points = 400*(count - 2);
        else if(count == 5) // 5 = 1600pts
            points = 1600;
        else if(count == 6) // 6 = 3200pts
            points = 3200;
    }
    if(i == 4) //5s
    {
        if(count < 3) // 1 = 50pts, 2 = 100pts
            points = 50*count;
        else if(count == 3) // 3 = 500pts
            points = 500;
        else if(count > 3 && count < 6) // 4 = 1000pts, 5 = 2000pts
            points = 1000*(count - 3);
        else // 6 = 4000pts
            points = 4000;
    }
    if(i == 5) //6s
    {
        if(count > 2 && count < 5) // 3 = 600pts, 4 = 1200pts
            points = 600*(count - 2);
        else if(count == 5) // 5 = 2400pts
            points = 2400;
        else if(count == 6) // 6 = 4800pts
            points = 4800;
    }

    return points; // Return possible point value
}

/**********************************************************
 * @brief Set all possibilities members to default
 * @param possibilities -> See class def for PossibleRolls
 * @param choices -> An array for all dice choices
**********************************************************/
function setDefaultValues(possibilities, choices)
{
    for(var i = 0; i < 6; i++)
    {
        possibilities[i].points = 0;
        possibilities[i].dupes = 0;
        possibilities[i].flag = false;

        choices[i] = 0;
    }
}

/**********************************************************
 * @brief Rolls all 6 dice and counts duplicates
 * @param dice_rolls -> See class def for Dice
 * @param possibilities -> See class def for PossibleRolls
**********************************************************/
function rollAllDice(dice_rolls, possibilities)
{
    for(var i = 0; i < 6; i++)
    {
        if(!dice_rolls[i].flag) // Die is available
        {
            dice_rolls[i].roll = determineRoll(); // Get roll
        
            // std::cout << "Roll die #" << i + 1 << ": " << dice_rolls[i].roll << std::endl;

            possibilities[dice_rolls[i].roll - 1].dupes++; // Count # of duplicate rolls
        }
    }
}

/****************************************************************************
 * @brief Get the # of the die that the user wants to set aside
 * @param reg -> Indicates regular vs non-regular dice (1,5 are non-regular)
 * @param input -> User choice for dice # (0 indicates stop picking)
 * @param all -> Indicates if any dice have been picked (true == none)
******************************************************************************/
function getRollNumberChoice(reg, input, all)
{
    // std::cout << "Choose which dice you would like to take.\nEnter a number (1-6) or enter 0 to stop: ";
    // std::cin >> input;

    while(input < 0 || input > 6 || (all && input == 0)) // Check for valid input
    {
        // if(input == 0) // User has not chosen any dice yet
            // std::cout << "You have not gained any points for this roll! Select a number to continue.";
        // else // input negative or greater than 6
            // std::cout << "Invalid input.";

        // std::cout << "\nEnter a number (1-6) or enter 0 to stop: ";
        // std::cin >> input;
    }

    if(input == 1 || input == 5) // 1s and 5s are non-regular
        reg = false;
    else // 2s, 3s, 4s, and 6s are regular
        reg = true;
}

/********************************************************************
 * @brief Get the # of duplicate dice the user wants to set aside
 * @param possibilities -> See class def for PossibleRolls
 * @param num -> # of dice user wants of that side
 * @param input -> # for the side on the dice
 * @param reg -> Indicates reg vs non-regular dice (1,5 are non-reg)
*********************************************************************/
function getRollNumberQuantity(possibilities, num, input, reg)
{
    // Get user input for # of dice
    // std::cout << "There are " << possibilities[input - 1].dupes << ' ' << input << "'s.\nHow many would you like to take? ";
    // std::cin >> num;

    // Check for valid input
    while(num < 0 || num > possibilities[input - 1].dupes || (reg && num < 3))
    {
        // std::cout << "Invalid input. Please enter again: ";
        // std::cin >> num;
    }
}

/*********************************************************************
 * @brief Checks if the user would like to roll again for more points
 * @param not_all -> Indicates whether to roll again (true == roll)
*********************************************************************/
function continueRoll(not_all)
{
    // Declare variables
    var ans; // Stores user input

    // Get user input for re-roll
    // std::cout << "Would you like to roll again? Enter y/n: ";
    // std::cin >> ans;

    // Check for valid input
    while(ans != 'y' && ans != 'Y' && ans != 'N' && ans != 'n')
    {
        // std::cout << "Invalid input. Please enter y/n: ";
        // std::cin >> ans;
    }

    if(ans == 'y' || ans == 'Y') // Re-roll condition
        not_all = true;
}

/************************************************************************************
 * @brief Checks for straight/pair conditions, possible points value, and duplicates
 * @param possibilities -> See class def for PossibleRolls 
 * @param straight -> Indicates if the special rule: straight was obtained
 * @param pairs -> Indicates if the special rule: pairs was obtained
 * @return int 
************************************************************************************/
function checkPointsRules(possibilities, straight, pairs)
{
    // Declare variables
    var points = 0; // Initial points possible

    // Loop through all rolls to check rules
    for(var i = 0; i < 6; i++)
    {
        // Check for possible points for #1-6
        if(((i == 0 || i == 4) && possibilities[i].dupes > 0) || possibilities[i].dupes > 2)
        {
            possibilities[i].flag = true; // Set flag

            points += determinePossiblePoints(i, possibilities[i].dupes); // Add to possible points
        }
        
        // Check for straight condition
        if(possibilities[i].dupes == 1)
            straight++;
        
        // Check for pair condition
        if(possibilities[i].dupes == 2)
            pairs++;
    }

    return points; // Return possible points value
}

/*****************************************************************
 * @brief Calculates total points earned based on user choices
 * @param possibilities -> See class def for PossibleRolls
 * @param dice_rolls -> See class def for Dice
 * @param choices -> An array for # of dice present for each side
 * @param cur_count -> Current counter for # of dice available
 * @return int 
******************************************************************/
function calculatePoints(possibilities, dice_rolls, choices, cur_count)
{
    // Declare variables
    var points = 0; // Initial points

    // Loop through all rolls and check for points
    for(var i = 0; i < 6; i++)
    {
        if(possibilities[i].points > 0) // Points possible
        {
            // Add points, update counter, and set flags so dice are ignored on next roll
            points += possibilities[i].points;
            cur_count -= choices[i];
            setRollFlags(dice_rolls, i + 1, choices[i]);
        }
    }

    return points; // Return total points calculated
}

/*********************************************************************************************************
 * @brief Checks which dice the user would like to set aside for the next roll or points in current round
 * @param possibilities -> See class def for PossibleRolls
 * @param choices -> An array for # of dice available for each side
 * @param cur_count -> # of dice available to choose from
**********************************************************************************************************/
void getUserChoices(possibilities, choices, cur_count)
{
    // Declare variables
    var input, num; // User input for dice to keep and how many
    var reg, all; // Indicates a roll that is not 1 or 5 and whether any dice have been picked

    do // Get user input for # they want to take
    {
        all = true; // No dice have been picked

        // Check all rolls for user choice
        for(var i = 0; i < 6; i++)
            if(choices[i] > 0)
                all = false; // Set flag, user picked at least one die

        getRollNumberChoice(reg, input, all); // Get the choice of number

        if(input > 0 && possibilities[input - 1].flag) // Check if input can give points
        {
            getRollNumberQuantity(possibilities, num, input, reg); // Get quantity from user

            if(num > 0) // User gets some points
            {
                // Store possible points and user choice for # for later use
                possibilities[input - 1].points = determinePossiblePoints(input - 1, num);
                choices[input - 1] = num;
            }
            else if(num == 0) // User choice 0 quantity, no points
            {
                // Store possible points and user choice for # for later use
                possibilities[input - 1].points = 0;
                choices[input - 1] = 0;
            }
        }
        // else if(input > 0) // User chose a # with no possible point values
            // std::cout << "Sorry the " << input << "'s did not score any points. Please choose another." << std::endl;
    } while(input != 0 && cur_count > 0); // Loop until user inputs 0 or there are no more dice left to choose
}

/*****************************************************************************
 * @brief Function rolls a single dice roll for a specified number of players
 * @param rolls -> The side rolled for each dice
 * @param num_players -> # of players in the game
******************************************************************************/
function rollAllPlayers(rolls, num_players)
{
    for(var i = 0; i < num_players; i++)
        rolls[i] = determineRoll();
}

/***************************
 * @brief Swaps two players
 * @param p1 -> Player 1
 * @param p2 -> Player 2
***************************/
function swapPlayers(p1, p2)
{
    temp = new Player(); // Create a temporary player
    p1.copyPlayerValues(temp, p2); // Copy constructor
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
    var pivot = (start + end) / 2;  // Calculate pivot point
    var swap_index = start;         // Get the initial swap index

    swapPlayers(players[pivot], players[end]); // Swap pivot and end

    pivot = end; // Set pivot to the end of the array

    // Starting from the beginning, find smaller values and swap
    for(var i = start; i < end; i++)
    {
        if(players[i] <= players[pivot]) // If smaller -> swap
        {
            swapPlayers(players[i], players[swap_index]);

            swap_index++;
        }
    }

    swapPlayers(players[swap_index], players[pivot]); // Swap pivot with new swap index

    return swap_index; // Return new swap index
}

/*********************************************************
 * @brief Quicksort by turn order for array of players
 * @param players -> See class def for Player
 * @param start -> Start index
 * @param end -> End index
*********************************************************/
void sortPlayers(players, start, end)
{
    if(start < end) // Recursive loop until start >= end
    {
        var pivot = partition(players, start, end); // Get the pivot

        sortPlayers(players, start, pivot - 1); // Run quicksort for left partition

        sortPlayers(players, pivot + 1, end); // Run quicksort for right partition
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
    var rolls; // array for each player's roll
    var indices; // array for index of each player
    var num_instances, turn = 0;    // # of duplicate rolls, turn order

    rollAllPlayers(rolls, num_players); // Each player rolls once initially

    // Starting with 6 -> 1 check for duplicate rolls
    for(var i = 6; i > 0; i--)
    {
        num_instances = 0;

        // Check all player rolls for duplicates
        for(var j = 0; j < num_players; j++)
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
        players[indices[0]].setTurn(turn++);
    else // Case: Duplicate rolls, re-roll all players for that number
    {
        // Declare initial variables
        var rolls;         // Array for each player's roll
        var dupe_indices;  // Array for duplicate indices
        var num_instances; // # of duplicate rolls

        rollAllPlayers(rolls, num_players); // All players roll again

        // Check for duplicates from 6 -> 1 again
        for(var i = 6; i > 0; i--)
        {
            num_instances = 0;

            // Checking only the previous duplicate players for more dupes
            for(var j = 0; j < num_players; j++)
            {
                if(rolls[j] == i) // If it matches, store it
                    dupe_indices[num_instances++] = indices[j];
            }

            getPlayerTurnsRecursive(players, dupe_indices, num_instances, turn); // Run recursive loop again for new dupes
        }
    }
}

/*******************************************************************************
 * @brief Determine how many points the current player will get from this round
 * @param p -> The player being processed
 * @return int 
*******************************************************************************/
function getPlayerPoints(p)
{
    // Declare variables
    const dice_nums = [1, 2, 3, 4, 5, 6];
    var dice_rolls = []; 
    var possibilites = [];           
    dice_nums.forEach((dice_num) => dice_rolls.push(new Dice(dice_num))); // Stores all dice rolls in each round
    dice_nums.forEach((dice_num) => possibilites.push(new PossibleRolls(dice_num))); // Stores possibilities for all rolls in each round
    var choices = [];               // Stores the user's choices for points
    var cur_count = 6,              // Indicates how many dice are left in each round
    points_psb, points = 0,         // Possible # of points and total # of points achieved
    straight, pairs;                // Indicates a straight or 3 pairs
    var all, not_all;              // Flags for all dice being used and some dice being used
    var ans;                       // User input for continuing their rolls

    do // Start rolling
    {
        // Initial declarations
        points_psb = 0;
        straight = 0;
        pairs = 0;

        // Set possibility values to default
        setDefaultValues(possibilities, choices);

        if(all) // All dice have been rolled
        {
            cur_count = 6; // Reset counter

            // Reset dice_rolls flags
            for(var i = 0; i < 6; i++)
                dice_rolls[i].flag = false;
        }
        
        // Reset flags to default
        all = false;
        not_all = false;

        // Roll all dice
        rollAllDice(dice_rolls, possibilities);

        // Check all rolls for duplicates, possible points, straights, and/or pairs
        points_psb += checkPointsRules(possibilities, choices, straight, pairs);

        if(straight == 6) // Straight = 1200pts, automatic re-roll
        {
            // std::cout << "You got a straight! Points are 1200, you get to roll again." << std::endl;
            points += 1200;
            all = true;
        }
        else if(pairs == 3) // 3 Pairs = 600pts, automatic re-roll
        {
            // std::cout << "You got three pairs! Points are 600, you get to roll again." << std::endl;
            points += 600;
            all = true;
        }
        else if(cur_count == 1 && points_psb > 0) // 1 die left and points possible, automatic re-roll
        {
            // std::cout << "Wow! Your last roll gave you " << points_psb << " points." << std::endl;
            points += points_psb;
            all = true;
        }
        else if(points_psb == 0) // No points possible, round ended
        {
            points = 0;
            // std::cout << "Sorry you did not roll any points for this round." << std::endl;
        }
        else // Points possible, ask user for choices
        {
            getUserChoices(possibilities, choices, cur_count); // Get choices

            // Loop through all possibilities and check for points
            points += calculatePoints(possibilities, dice_rolls, choices, cur_count);

            if(cur_count == 0) // All dice rolled, automatic re-roll
            {
                // std::cout << "Wow! You rolled all the dice, you get to roll again." << std::endl;
                all = true;
            }
            else // Some dice are still in need of re-rolling
            {
                // std::cout << "You currently have " << points << " points." << std::endl; // Show current points value

                // std::cout << "There are " << cur_count << " dice left." << std::endl; // Show current # of dice

                if(points >= 1000 || p.getPoints() >= 1000) // Check if points 1000+ or if user currently has 1000+
                    continueRoll(not_all);
                else // User HAS to re-roll (does not have 1000+ pts yet)
                    not_all = true;
            }
        }

        // if(points > 0) // Show current points value
            // std::cout << "You currently have " << points << " points." << std::endl;

    }while(all || not_all); // Loop until user quits rolling or gets zero points

    return points; // Return # points gained
}
