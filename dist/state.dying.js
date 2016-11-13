var State = require('./state.js');
var InterruptingStatesHolder = require('InterruptingStatesHolder');
/**
 * Created by gerson on 11/8/2016.
 */

class StateDying extends State {

    getName() {
        return 'DYING';
    }
    static isInterrupt(creep){
        return creep.ticksToLive < 100;
    }
    
    initSwitch(creep) {
        creep.memory.renewCount = 0;
    }

    doStateStrategy(creep){
        creep.memory.renewCount += 1;
        var spawns = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_SPAWN)}});
        if (spawns[0].renewCreep(creep) == ERR_NOT_IN_RANGE) {
            creep.moveTo(spawns[0]);
        }

        if (creep.ticksToLive > 1300 || creep.memory.renewCount > 20)
        {
            var statePrototype = StateSwitcher.getDefaultStateForRole(creep.memory.role);
            StateSwitcher.switchState(creep, statePrototype);
        }
    }
};
InterruptingStatesHolder.registerInterruptingState(StateDying.prototype);

module.exports = StateDying;