/**
 * Created by gerson on 11/8/2016.
 */

const DYING = 'DYING';
const HARVEST = 'HARVEST';
const TRANSFER = 'TRANSFER';
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
