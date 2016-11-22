"use strict";
/**
 * Created by gerson on 11/8/2016.
 */
var StateHarvest = require('./state.harvest.js');
var StateDying = require('./state.dying.js');
var StateTransfer = require('./state.transfer.js');
var InterruptingStatesHolder = require('./interruptingStates.js');

const DYING = StateDying.getName();
const HARVEST = StateHarvest.getName();
const TRANSFER = StateTransfer.getName();
const DEFAULT = 'DEFAULT';


const roleDefaultState = {
    'harvester' : StateHarvest
};

const nameToState = {
    DYING : StateDying.prototype,
    HARVEST : StateHarvest.prototype,
    TRANSFER : StateTransfer.prototype
}


class StateController {
    
    static getDefaultStateForRole(role) {
        return roleDefaultState[role];
    }

    static executeState(creep){
        if(!_.isString(creep.memory.currentState)) {
            creep.memory.currentState = this.prototype.getDefaultStateNameForRole(creep);
        }

        var stateToPerform = this.prototype.getStateByName(creep.memory.currentState);

        for (var interruptingState in InterruptingStatesHolder.getInterruptingStates())
        {
            if (interruptingState.isInterrupt(creep))
            {
                stateToPerform = this.switchState(creep, interruptingState);
            }
        }

        stateToPerform.doStateStrategy(creep);

        if (stateToPerform.shouldItSwitch(creep)) {
            this.switchState(creep, )
        }
    }

    static getDefaultStateNameForRole(creep)
    {
        return roleDefaultState[creep.memory.role].getName();
    }


    static switchState(creep, statePrototype)
    {
        creep.memory.currentState = statePrototype.stateName;
        var state = new statePrototype();
        state.initSwitch();
        return state;
    }


    static getStateByName(name)
    {
        return nameToState[name];
    }
}

module.exports = StateController;
