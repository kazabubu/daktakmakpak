var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        const STATE = {
            HARVEST: 'Harvest',
            DIEING: 'Dieing',
            TRANSFER: 'TRANSFER'
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
        if (typeof creep.memory.currentState == 'undefined')
        {
            creep.memory.currentState = STATE.HARVEST;
        }

        var prevPos = creep.memory.prevPos;
        creep.memory.prevPos = creep.pos;
        if (prevPos == creep.pos)
        {
            creep.memory.currentPath = null;
        }

        if(creep.carry.energy < creep.carryCapacity && creep.memory.currentState == STATE.HARVEST) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else if (creep.carry.energy == creep.carryCapacity || creep.memory.currentState == STATE.TRANSFER) {
            creep.memory.currentState = STATE.TRANSFER;
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }

            if (creep.carry.energy == 0)
            {
                creep.memory.currentState = STATE.HARVEST;
            }
        }
    }
};

module.exports = roleHarvester;