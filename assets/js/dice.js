/********************* CLASS DEFINITIONS *********************/

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