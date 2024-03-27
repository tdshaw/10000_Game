#ifndef PLAYER_H
#define PLAYER_H
#include <string>

/**
 * @brief Player class
 * Private members:
    * Name of player
    * Turn order for player
    * Points player has
    * Flag for turn order (or anything I need it for) 
 * Public Members:
    * setName, getName
    * setFlag, getFlag
    * setTurn, getTurn
    * setPoints, addPoints, getPoints
    * operator=, operator<, operator<=
 */
class Player
{
    private:
    std::string name = "";
    int turn = -1;
    int points = 0;
    bool flag = false;

    public:
    void setName(const std::string input) { this->name = input; };
    const std::string getName() { return this->name; };
    void setFlag(bool input) { this->flag = input; };
    const bool getFlag() { return this->flag; };
    void setTurn(int input) { this->turn = input; this->setFlag(true); };
    const int getTurn() { return this->turn; };
    void setPoints(int input) { this->points = input; };
    void addPoints(int input) { this->points += input; };
    const int getPoints() { return this->points; };
    void operator =(Player& p);
    bool operator <(const Player p) { return (this->turn < p.turn) ? true:false;};
    bool operator <=(const Player p) { return (this->turn <= p.turn) ? true:false; };
};

/**
 * @brief Definition for operator= -> Copy constructor for players
 * @param p 
 */
void Player::operator =(Player& p) 
{ 
    Player temp; 
    temp.name = p.name; 
    temp.turn = p.turn; 
    temp.points = p.points;

    p.name = this->name;
    p.turn = this->turn;
    p.points = this->points;

    this->name = temp.name;
    this->turn = temp.turn;
    this->points = temp.points; 
}

#endif
