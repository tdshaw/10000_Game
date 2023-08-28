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

int determineRoll();
void getPlayerNames(Player ar[], const int num_players);
void getPlayerTurns(Player ar[], const int num_players);

int main()
{
    srand(time(0));

    int num_players, roll, high_roll = 0, index;

    std::cout << "Welcome to the dice game 10,000! \nHow many players? Enter a number (2-6): ";
    std::cin >> num_players;

    Player players[num_players];

    std::cout << "\nGetting player names..." << std::endl;

    getPlayerNames(players, num_players);

    std::cout << "\nDetermining who rolls first..." << std::endl;

    getPlayerTurns(players, num_players);

    return 0;
}

int determineRoll()
{
    return rand() % 6 + 1;
}

void getPlayerNames(Player ar[], const int num_players)
{
std::string input;

    for(int i = 0; i < num_players; i++)
    {
        std::cout << "Player " << i + 1 << " enter your name: ";
        std::cin >> input;
        ar[i].setName(input);
    }
}

void getPlayerTurns(Player ar[], const int num_players)
{
    int roll, prev_roll, index, high_roll = 0;
    int incomplete[num_players];
    bool done = true;

    do {
        for(int i = 0; i < num_players; i++)
        {
            roll = determineRoll();

            ar[i].setTurn(roll);

            if(roll > high_roll)
            {
                high_roll = roll;
                index = i;
            }

            std::cout << ar[i].getName() << " rolled a " << roll << std::endl;
        }

    } while(!done);

    std::cout << ar[index].getName() << " gets to start." << std::endl;
}
