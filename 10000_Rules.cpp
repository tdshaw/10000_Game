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

struct FirstRoll
{
    int indices[CAPACITY];
    int instances = 0;
};

int determineRoll();
void rollAll(int ar[], const int size);
void getPlayerNames(Player ar[], const int num_players);
void getPlayerTurns(Player ar[], const int num_players);
void getPlayerTurnsRecursive(Player ar[], int indices[], int num_players, int& turn);
void swapPlayers(Player& p1, Player& p2);
int partition(Player ar[], int start, int end);
void sortPlayers(Player ar[], int start, int end);

void rollSome(const int ar1[], int ar2[], const int size1, const int size2);

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

    sortPlayers(players, 0, num_players - 1);

    std::cout << players[0].getName() << " will roll first. Turn#" << players[0].getTurn() << std::endl;

    return 0;
}

int determineRoll()
{
    return rand() % 6 + 1;
}

void rollAll(int ar[], const int size)
{
    int roll;

    for(int i = 0; i < size; i++)
    {
        roll = determineRoll();
        ar[i] = roll;
        std::cout << i << ": " << roll << std::endl;
    }
    std::cout << std::endl;
}

void rollSome(const int ar1[], int ar2[], const int size1, const int size2)
{
    for(int i = 0; i < size1; i++)
        for(int j = 0; j < size2; j++)
            ar2[ar1[i]] = determineRoll();
}

void findAndRemove(int ar1[], const int idx, int& size)
{
    for(int i = idx; i < size - 1; i++)
        ar1[i] = ar1[i + 1];

    size--;
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

void getPlayerTurns(Player ar[], const int num_players)
{
    int all_rolls[num_players];
    int dupe_rolls[num_players];
    int dupe_indices[num_players];
    int num_instances, highest_roll, highest_idx, turn = 0;
    int roll;
    bool done;

    std::cout << "Initial roll..." << std::endl;

    for(int i = 0; i < num_players; i++)
    {
        roll = determineRoll();
        all_rolls[i] = roll;

        std::cout << ar[i].getName() << " rolled a " << roll << std::endl; 
    }
    std::cout << std::endl;

    for(int i = 6; i > 0; i--)
    {
        num_instances = 0;

        for(int j = 0; j < num_players; j++)
            if(!ar[j].getFlag() && all_rolls[j] == i)
               dupe_indices[num_instances++] = j;
    
        std::cout << "Dupes for " << i << "'s" << std::endl;
        getPlayerTurnsRecursive(ar, dupe_indices, num_instances, turn);
    }
}

void getPlayerTurnsRecursive(Player ar[], int indices[], int num_players, int& turn)
{
    if(num_players == 0)
        return;
    else if(num_players == 1)
        ar[indices[0]].setTurn(turn++);
    else
    {
        int rolls[num_players];
        int dupe_indices[num_players];
        int num_instances, roll;

        std::cout << "Dupes roll..." << std::endl;
        for(int i = 0; i < num_players; i++)
        {
            roll = determineRoll();
            rolls[i] = roll;
            std::cout << ar[indices[i]].getName() << " rolled a " << roll << std::endl; 
        }
        std::cout << std::endl;

        for(int i = 6; i > 0; i--)
        {
            num_instances = 0;

            for(int j = 0; j < num_players; j++)
                if(rolls[j] == i)
                    dupe_indices[num_instances++] = indices[j];

            std::cout << "Dupes for " << i << "'s" << std::endl;
            getPlayerTurnsRecursive(ar, dupe_indices, num_instances, turn);
        }
    }
}

void swapPlayers(Player& p1, Player& p2)
{
    Player temp = p1;
    p1 = p2;
    p2 = temp;
}

int partition(Player ar[], int start, int end)
{
    int pivot = (start + end) / 2;
    int swap_index = start;

    swapPlayers(ar[pivot], ar[end]);

    pivot = end;

    for(int i = start; i < end; i++)
    {
        if(ar[i] <= ar[pivot])
        {
            swapPlayers(ar[i], ar[swap_index]);

            swap_index++;
        }
    }

    swapPlayers(ar[swap_index], ar[pivot]);

    return swap_index;
}

void sortPlayers(Player ar[], int start, int end)
{
    if(start < end)
    {
        int pivot = partition(ar, start, end);

        sortPlayers(ar, start, pivot - 1);

        sortPlayers(ar, pivot + 1, end);
    }
}
