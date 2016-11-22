

/**
 * Created by gerson on 11/8/2016.
 */

class State {

    static getName(){};

    static isInterrupt(creep){
        return false;
    };

    static initSwitch(creep){};

    static doStateStrategy(creep){throw new TypeError("abstract")};

    static shouldItSwitch(creep){throw new TypeError("abstract")};
}

module.exports = State;