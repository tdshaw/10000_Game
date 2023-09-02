#ifndef PLAYER_H
#define PLAYER_H
#include <string>

class Player
{
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
    void operator =(Player& p);
    bool operator <(const Player p) { return (this->turn < p.turn) ? true:false;};
    bool operator <=(const Player p) { return (this->turn <= p.turn) ? true:false; };
};

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
