
//var StateDying = require('./state.dying.js');
var InterruptingStatesHolder = require('./interruptingStates.js');
/**
 * Created by gerson on 11/8/2016.
 */

class State {

    static isInterrupt(creep){
        return false;
    }

    initSwitch(creep){};
    doState(creep){
        var stateToPerform = this;
        for (var interrupting in InterruptingStatesHolder.getInterruptingStates())
        {
            if (interruptingState.isInterrupt(creep))
            {
               stateToPerform = StateSwitcher.switchState(creep, interrupting);
            }
        }

        stateToPerform.doStateStrategy(creep);
    };
    doStateStrategy(creep){throw new TypeError("abstract")};
    
    get stateName(){return name;};
}

module.exports = State;