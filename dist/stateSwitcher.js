/**
 * Created by gerson on 11/8/2016.
 */
var StateDying = require('StateDying');
var StateHarvest = require('StateHarvest');
var StateTransfer = require('StateTransfer');

const DYING = StateDying.getName();
const HARVEST = StateHarvest.getName();
const TRANSFER = StateTransfer.getName();
const DEFAULT = 'DEFAULT';


const roleDefaultState = {
    'harvester' : StateHarvest.prototype
};

const nameToState = {
    DYING : StateDying.prototype,
    HARVEST : StateHarvest.prototype,
    TRANSFER : StateTransfer.prototype
}


class StateSwitcher {
    
    static getDefaultStateForRole(role) {
        return roleDefaultState[role];
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
