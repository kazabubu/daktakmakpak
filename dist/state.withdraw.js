"use strict";
var State = require('./state.js');

class StateWithdraw extends State {


    static getName() {
        return 'WITHDRAW';
    };

    static isInterrupt(creep){

    };

    initSwitch(creep) {

    };

    doStateStrategy(creep){
        if(creep.carry.energy < creep.carryCapacity && creep.memory.currentState == STATE.TRANSFER) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_CONTAINER)
                        && (!!structure.energy && structure.energy > (structure.energyCapacity * 0.3)) ||
                        (!!structure.store && structure.store.energy > (structure.storeCapacity * 0.3))
                    );
                }
            });
            if (targets && targets.length > 0)
                if(creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
        }

    }

    shouldItSwitch(creep) {
        return creep.carry.energy == 0;
    }
}

module.exports = StateWithdraw;

