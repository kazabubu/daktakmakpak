/**
 * Created by gerson on 11/8/2016.
 */
const interruptingState = [StateDying.prototype];
class State {
    

    
    initSwitch(creep){};
    doState(creep){
        var stateToPerform = this;
        for (var interrupting in interruptingState)
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