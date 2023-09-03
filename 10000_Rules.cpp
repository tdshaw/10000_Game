#include <iostream>
#include <cstdlib>
#include "player.h"

/*
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
*/

const int CAPACITY = 10;

struct Rolls
{
    int roll;
    bool flag = false;
};

struct PossibleRolls
{
    int dupes = 0;
    int points = 0;
    bool flag = false;
};

int determineRoll();
void rollAll(int rolls[], const int num_players);
void swapPlayers(Player& p1, Player& p2);
int partition(Player players[], int start, int end);
void sortPlayers(Player players[], int start, int end);
void getPlayerNames(Player players[], const int num_players);
void getPlayerTurns(Player players[], const int num_players);
void getPlayerTurnsRecursive(Player players[], int indices[], const int num_players, int& turn);
int getPlayerPoints(Player& p);
void setRollFlag(Rolls dice_rolls[], const int input);
void setRollFlags(Rolls dice_rolls[], const int input, const int num);
int determinePossiblePoints(const int i, const int count);

int main()
{
    srand(time(0)); // Set random seed

    // Declare initial variables
    int num_players; // Stores the number of players for the game  

    // Get number of players from user
    std::cout << "Welcome to the dice game 10,000! \nHow many players? Enter a number (2-10): ";
    std::cin >> num_players;

    // Check for valid input (2-10 players)
    while(num_players < 2 || num_players > 10)
    {
      std::cout << "Invalid input. Enter a number (2-10): ";  
      std::cin >> num_players;
    }

    Player players[num_players]; // Create a players array with # of players

    std::cout << "\nGetting player names..." << std::endl;

    getPlayerNames(players, num_players); // Get all player names

    std::cout << "\nDetermining who rolls first..." << std::endl;

    getPlayerTurns(players, num_players); // Roll for order of play for each player

    sortPlayers(players, 0, num_players - 1); // Sort the players array by turn order

    std::cout << players[0].getName() << " will roll first." << std::endl << std::endl; // Starting player msg

    // For all players, each rolls 6 dice. Based on the rules above, player can keep rolling until they reach 1000 pts. 
    // Then they can take as many pts as they want until reaching 10,000 pts.
    for(int i = 0; i < num_players; i++)
    {
        std::cout << "Rolling for " << players[i].getName() << std::endl;
        players[i].setPoints(getPlayerPoints(players[i]));
        std::cout << players[i].getName() << " now has " << players[i].getPoints() << " points." << std::endl << std::endl;
    }

    return 0;
}

/**
 * @brief Function returns a random value between 1-6. Acts as one dice roll
 * @return int 
 */
int determineRoll()
{
    return rand() % 6 + 1;
}

/**
 * @brief Function rolls a single dice roll for a specified number of players
 * 
 * @param rolls 
 * @param num_players 
 */
void rollAll(int rolls[], const int num_players)
{
    for(int i = 0; i < num_players; i++)
        rolls[i] = determineRoll();
}

/**
 * @brief Swaps two players
 * 
 * @param p1 
 * @param p2 
 */
void swapPlayers(Player& p1, Player& p2)
{
    Player temp = p1;
    p1 = p2;
    p2 = temp;
}

/**
 * @brief Partition function for quicksorting the array of players by turn order
 * 
 * @param players 
 * @param start 
 * @param end 
 * @return int 
 */
int partition(Player players[], int start, int end)
{
    // Declare initial variables
    int pivot = (start + end) / 2;  // Calculate pivot point
    int swap_index = start;         // Get the initial swap index

    swapPlayers(players[pivot], players[end]); // Swap pivot and end

    pivot = end; // Set pivot to the end of the array

    // Starting from the beginning, find smaller values and swap
    for(int i = start; i < end; i++)
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

/**
 * @brief Quicksort by turn order for array of players
 * 
 * @param players 
 * @param start 
 * @param end 
 */
void sortPlayers(Player players[], int start, int end)
{
    if(start < end) // Recursive loop until start >= end
    {
        int pivot = partition(players, start, end); // Get the pivot

        sortPlayers(players, start, pivot - 1); // Run quicksort for left partition

        sortPlayers(players, pivot + 1, end); // Run quicksort for right partition
    }
}

/**
 * @brief Get the Player Names object for each player
 * 
 * @param players 
 * @param num_players 
 */
void getPlayerNames(Player players[], const int num_players)
{
    std::string input;

    for(int i = 0; i < num_players; i++)
    {
        std::cout << "Player " << i + 1 << " enter your name: ";
        std::cin >> input;

        players[i].setName(input);
    }
}

/**
 * @brief Get the Player Turns object for each player
 * 
 * @param players 
 * @param num_players 
 */
void getPlayerTurns(Player players[], const int num_players)
{
    // Declare initial variables
    int rolls[num_players];         // array for each player's roll
    int indices[num_players];       // array for index of each player
    int num_instances, turn = 0;    // # of duplicate rolls, turn order

    rollAll(rolls, num_players); // Each player rolls once initially

    // Starting with 6 -> 1 check for duplicate rolls
    for(int i = 6; i > 0; i--)
    {
        num_instances = 0;

        // Check all player rolls for duplicates
        for(int j = 0; j < num_players; j++)
            if(!players[j].getFlag() && rolls[j] == i) // Check if player has a turn order yet and the roll is duplicate
               indices[num_instances++] = j;

        getPlayerTurnsRecursive(players, indices, num_instances, turn); // For all duplicates within 6 -> 1 run a recursive loop
    }
}

/**
 * @brief Get the Player Turns object for each player
 * 
 * @param players 
 * @param indices 
 * @param num_players 
 * @param turn 
 */
void getPlayerTurnsRecursive(Player players[], int indices[], const int num_players, int& turn)
{
    if(num_players == 0) // Base Case: No duplicate rolls
        return;
    else if(num_players == 1) // Base Case: 1 duplicate roll, set turn order for that player
        players[indices[0]].setTurn(turn++);
    else // Case: Duplicate rolls, re-roll all players for that number
    {
        // Declare initial variables
        int rolls[num_players];         // Array for each player's roll
        int dupe_indices[num_players];  // Array for duplicate indices
        int num_instances;              // # of duplicate rolls

        rollAll(rolls, num_players); // All players roll again

        // Check for duplicates from 6 -> 1 again
        for(int i = 6; i > 0; i--)
        {
            num_instances = 0;

            // Checking only the previous duplicate players for more dupes
            for(int j = 0; j < num_players; j++)
                if(rolls[j] == i) // If it matches, store it
                    dupe_indices[num_instances++] = indices[j];

            getPlayerTurnsRecursive(players, dupe_indices, num_instances, turn); // Run recursive loop again for new dupes
        }
    }
}

/* 
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
*/
int getPlayerPoints(Player& p)
{
    Rolls dice_rolls[6];
    PossibleRolls possibilities[6];
    int input, roll, num, count = 6, straight, pairs, points_psb, points = 0;
    bool all, not_all;
    char ans;

    do
    {
        points_psb = 0;
        straight = 0;
        pairs = 0;

        for(int i = 0; i < 6; i++)
        {
            possibilities[i].points = 0;
            possibilities[i].dupes = 0;
        }

        if(all)
        {
            count = 6;
            for(int i = 0; i < 6; i++)
                dice_rolls[i].flag = false;
        }
        
        all = false;
        not_all = false;

        for(int i = 0; i < 6; i++)
        {
            if(!dice_rolls[i].flag) // Die is available
            {
                dice_rolls[i].roll = determineRoll();
            
                std::cout << "Roll die #" << i + 1 << ": " << dice_rolls[i].roll << std::endl;

                possibilities[dice_rolls[i].roll - 1].dupes++;
            }
        }

        for(int i = 0; i < 6; i++)
        {
            if(possibilities[i].dupes > 0)
            {
                possibilities[i].flag = true;
                possibilities[i].points = determinePossiblePoints(i, possibilities[i].dupes);
            }

            std::cout << "For " << i + 1 << "s points are: " << possibilities[i].points << std::endl;

            points_psb += possibilities[i].points;
            
            if(possibilities[i].dupes == 1)
                straight++;
            
            if(possibilities[i].dupes == 2)
                pairs++;
        }

        if(straight == 6)
        {
            std::cout << "You got a straight! Points are 1200, you get to roll again." << std::endl;
            points += 1200;
            all = true;
        }
        else if(pairs == 3)
        {
            std::cout << "You got three pairs! Points are 600, you get to roll again." << std::endl;
            points += 600;
            all = true;
        }
        else if(points_psb == 0)
            std::cout << "Sorry you did not roll any points for this round." << std::endl;
        else
        {
            do
            {
                std::cout << "Choose which dice you would like to take. Enter a number (1-6) or enter 0 to stop: ";
                std::cin >> input;

                if((input > 0 && input < 7) && possibilities[input - 1].flag) // Valid
                {
                    if(possibilities[input - 1].dupes > 1)
                    {
                        std::cout << "How many would you like to take? ";
                        std::cin >> num;

                        while(num < 1 || num > possibilities[input - 1].dupes)
                        {
                            std::cout << "Invalid input. Please enter again: ";
                            std::cin >> num;
                        }

                        points += determinePossiblePoints(input - 1, num);
                        setRollFlags(dice_rolls, input, num);

                        count -= num;
                    }
                    else if(possibilities[input - 1].dupes == 1)
                    {
                        points += possibilities[input - 1].points;
                        possibilities[input - 1].flag = false;
                        count--;
                        setRollFlag(dice_rolls, input);
                    }
                }
                else if((input > 0 && input < 7) && !possibilities[input - 1].flag)
                    std::cout << "Sorry the " << input << "'s did not score any points. Please choose another." << std::endl;
            }while(input != 0 && count > 0);

            if(count == 0)
            {
                std::cout << "Wow! You rolled all the dice, you get to roll again." << std::endl;
                all = true;
            }
            else
            {
                std::cout << "Would you like to roll again? Enter y/n: ";
                std::cin >> ans;
                while(ans != 'y' && ans != 'Y' && ans != 'N' && ans != 'n')
                {
                    std::cout << "Invalid input. Please enter y/n: ";
                    std::cin >> ans;
                }

                if(ans == 'y' || ans == 'Y')
                    not_all = true;
            }
        }

        std::cout << "You currently have " << points << " points." << std::endl;
    }while(all || not_all);

    return points;
}

void setRollFlag(Rolls dice_rolls[], const int input)
{
    for(int i = 0; i < 6; i++)
        if(dice_rolls[i].roll == input)
            dice_rolls[i].flag = true;
}

void setRollFlags(Rolls dice_rolls[], const int input, const int num)
{
    int count = num;
    for(int i = 0; count > 0 && i < 6; i++)
        if(dice_rolls[i].roll == input)
        {
            count--;
            dice_rolls[i].flag = true;
        }
}

int determinePossiblePoints(const int i, const int count)
{
    int points = 0;

    if(i == 0)
    {
        if(count < 3)
            points = count*100;
        else if(count == 3)
            points = 1000;
        else if(count > 3 && count < 6)
            points = 2000*(count - 3);
        else    
            points = 8000;
    }
    if(i == 1)
    {
        if(count > 2 && count < 5)
            points = 200*(count - 2);
        else if(count == 5)
            points = 800;
        else if(count == 6)
            points = 1600;
    }
    if(i == 2)
    {
        if(count > 2 && count < 5)
            points = 300*(count - 2);
        if(count == 5)
            points = 1200;
        else if(count == 6)
            points = 2400;
    }
    if(i == 3)
    {
        if(count > 2 && count < 5)
            points = 400*(count - 2);
        else if(count == 5)
            points = 1600;
        else if(count == 6)
            points = 3200;
    }
    if(i == 4)
    {
        if(count < 3)
            points = 50*count;
        else if(count == 3)
            points = 500;
        else if(count > 3 && count < 6)
            points = 1000*(count - 3);
        else
            points = 4000;
    }
    if(i == 5)
    {
        if(count > 2 && count < 5)
            points = 600*(count - 2);
        else if(count == 5)
            points = 2400;
        else if(count == 6)
            points = 4800;
    }

    return points;
}
