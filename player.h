#include <string>

class Player
{
    std::string name = "";
    int turn = -1;
    int points = 0;

    public:
    void setName(const std::string input) { this->name = input; };
    const std::string getName() { return this->name; };
    void setTurn(const int input) { this->turn = input; };
    const int getTurn() { return this->turn; };
};