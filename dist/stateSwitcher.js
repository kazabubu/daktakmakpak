/**
 * Created by gerson on 11/8/2016.
 */

const roleDefaultState = {
    'harvester' : StateHarvest.prototype
};

const nameToSate = {
    'DYING' : StateDying.prototype,
    'HARVEST' : StateHarvest.prototype
}


class StateSwitcher {
    
    static getDefaultStateForRole(role) {
        return this.roleDefaultState;
    }

    static switchState(creep, statePrototype)
    {
        creep.memory.currentState = statePrototype.stateName;
        var state = new statePrototype();
        state.initSwitch();
        return state;
    }
}
