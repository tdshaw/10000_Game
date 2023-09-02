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

int determineRoll();
void rollAll(int rolls[], const int num_players);
void getPlayerNames(Player players[], const int num_players);
void getPlayerTurns(Player players[], const int num_players);
void getPlayerTurnsRecursive(Player players[], int indices[], const int num_players, int& turn);
void swapPlayers(Player& p1, Player& p2);
int partition(Player players[], int start, int end);
void sortPlayers(Player players[], int start, int end);

int main()
{
    srand(time(0));

    int num_players, roll, high_roll = 0, index;

    std::cout << "Welcome to the dice game 10,000! \nHow many players? Enter a number (2-10): ";
    std::cin >> num_players;

    while(num_players < 2 || num_players > 10)
    {
      std::cout << "Invalid input. Enter a number (2-10): ";  
      std::cin >> num_players;
    }

    Player players[num_players];

    std::cout << "\nGetting player names..." << std::endl;

    getPlayerNames(players, num_players);

    std::cout << "\nDetermining who rolls first..." << std::endl;

    getPlayerTurns(players, num_players);

    for(int i =0; i < num_players; i++)
        std::cout << players[i].getName() << " " << players[i].getTurn() << std::endl;
    std::cout << std::endl;

    sortPlayers(players, 0, num_players - 1);

    for(int i =0; i < num_players; i++)
        std::cout << players[i].getName() << " " << players[i].getTurn() << std::endl;
    std::cout << std::endl;

    std::cout << players[0].getName() << " will roll first. Turn#" << players[0].getTurn() << std::endl;

    return 0;
}

int determineRoll()
{
    return rand() % 6 + 1;
}

void rollAll(int rolls[], const int num_players)
{
    for(int i = 0; i < num_players; i++)
        rolls[i] = determineRoll();
}

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

/*
 * Everyone rolls once
    * Highest roll goes first, etc (highest -> turn = 0, lowest -> turn = num_players - 1)
    * Check for duplicates
        * Repeat steps

 * Recursive Steps:
    * Start from 6 -> 1 
    * Base Case: # rolled once
        * Add turn to player
    * Case: Duplicate rolls
        * Re-roll duplicates  
*/

void getPlayerTurns(Player players[], const int num_players)
{
    int rolls[num_players];
    int indices[num_players];
    int num_instances, turn = 0;

    rollAll(rolls, num_players);

    for(int i = 6; i > 0; i--)
    {
        num_instances = 0;

        for(int j = 0; j < num_players; j++)
            if(!players[j].getFlag() && rolls[j] == i)
               indices[num_instances++] = j;

        getPlayerTurnsRecursive(players, indices, num_instances, turn);
    }
}

void getPlayerTurnsRecursive(Player players[], int indices[], const int num_players, int& turn)
{
    if(num_players == 0)
        return;
    else if(num_players == 1)
        players[indices[0]].setTurn(turn++);
    else
    {
        int rolls[num_players];
        int dupe_indices[num_players];
        int num_instances;

        rollAll(rolls, num_players);

        for(int i = 6; i > 0; i--)
        {
            num_instances = 0;

            for(int j = 0; j < num_players; j++)
                if(rolls[j] == i)
                    dupe_indices[num_instances++] = indices[j];
                    
            getPlayerTurnsRecursive(players, dupe_indices, num_instances, turn);
        }
    }
}

void swapPlayers(Player& p1, Player& p2)
{
    Player temp = p1;
    p1 = p2;
    p2 = temp;
}

int partition(Player players[], int start, int end)
{
    int pivot = (start + end) / 2;
    int swap_index = start;

    swapPlayers(players[pivot], players[end]);

    pivot = end;

    for(int i = start; i < end; i++)
    {
        if(players[i] <= players[pivot])
        {
            swapPlayers(players[i], players[swap_index]);

            swap_index++;
        }
    }

    swapPlayers(players[swap_index], players[pivot]);

    return swap_index;
}

void sortPlayers(Player players[], int start, int end)
{
    if(start < end)
    {
        int pivot = partition(players, start, end);

        sortPlayers(players, start, pivot - 1);

        sortPlayers(players, pivot + 1, end);
    }
}
