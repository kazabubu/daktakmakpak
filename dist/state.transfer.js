/**
 * Created by or on 09/11/2016.
 */
var State = require('./state.js');

class StateTransfer extends State {


    static getName() {
        return 'TRANSFER';
    };

    static isInterrupt(creep){

    };

    initSwitch(creep) {

    };

    doStateStrategy(creep){
        if (creep.energy > 0) {
            if (!creep.memory.currentTarget) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            // structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_TOWER) && ((typeof structure.energy !== 'undefined' && structure.energy < structure.energyCapacity) ||
                            (typeof structure.store !== 'undefined' && structure.store.energy < structure.storeCapacity));
                    }
                });
                creep.memory.currentTarget = targets.length > 0 ? targets[0].id : null;
            }

            if (!!creep.memory.currentTarget) {
                var currTarget = Game.getObjectById(creep.memory.currentTarget);
                if (creep.transfer(currTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(currTarget);
                }
                else {
                    creep.memory.currentTarget = null;
                    creep.memory.currentPath = null;
                }
            }

            if (creep.carry.energy < (creep.carry.energyCapacity * 0.2 )) {
                creep.memory.currentState = STATE.HARVEST;
                creep.memory.currentPath = null;
                creep.memory.currentSource = null;
                creep.memory.prevPos = null;
                creep.memory.currentResource = null;
            }
        }
        else {
            var statePrototype = StateSwitcher.getDefaultStateForRole(creep.memory.role);
            StateSwitcher.switchState(creep, statePrototype);
        }

    }
}

module.exports = StateTransfer;

