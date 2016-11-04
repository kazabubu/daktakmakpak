/**
 * Created by or on 04/11/2016.
 */
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        const STATE = {
            HARVEST: 'Harvest',
            UPGRADE: 'Upgrade',
            DIEING: 'Dieing',
            BUILDER: 'BUILDER'
        };

        const DEFAULT_STATE = STATE.HARVEST;

        if (creep.ticksToLive < 100)
        {
            creep.memory.currentState = STATE.DIEING;
        }

        if (creep.memory.currentState == STATE.DIEING){
            var spawns = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN)}});
            if (spawns[0].renewCreep(creep) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawns[0]);
            }

            if (creep.ticksToLive > 1300)
            {
                creep.memory.currentState = DEFAULT_STATE;
            }
        }

        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
    }
};

module.exports = roleBuilder;