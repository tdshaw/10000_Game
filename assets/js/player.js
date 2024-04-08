/********************* CLASS DEFINITION *********************/

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
}