#include <iostream>
#include <cstdlib>

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

class Player
{
    std::string name = "";
    int turn;
    int points = 0;

    public:
    void setName(std::string input) { this->name = input; };
    std::string getName() { return this->name; };
    void setTurn() { this->turn = determineRoll(); };
    int getTurn() { return this->turn; };
};

int main()
{
    srand(time(0));

    int num_players, high_roll = 0, index;

    std::cout << "Welcome to the dice game 10,000! \nHow many players? Enter a number (2-6): ";
    std::cin >> num_players;

    Player players[num_players];

    std::cout << "\nDetermining who rolls first..." << std::endl;
    
    for(int i = 0; i < num_players; i++)
    {
        players[i].setName("Player " + std::to_string(i + 1));
        players[i].setTurn();

        if(players[i].getTurn() > high_roll)
        {
            high_roll = players[i].getTurn();
            index = i;
        }

        std::cout << players[i].getName() << " rolled a " << players[i].getTurn() << std::endl;
    }

    std::cout << players[index].getName() << " gets to start." << std::endl;

    return 0;
}

int determineRoll()
{
    return rand() % 6 + 1;
}
