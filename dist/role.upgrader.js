var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const STATE = {
            HARVEST: 'Harvest',
            UPGRADE: 'Upgrade',
            DIEING: 'Dieing'
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
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1]);
            }
        }
        else if (creep.carry.energy == creep.carryCapacity || creep.memory.currentState == STATE.UPGRADE) {
            creep.memory.currentState = STATE.UPGRADE;
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                if (typeof creep.memory.currentPath == 'undefined') {
                    creep.memory.currentPath = creep.room.findPath(creep.pos ,creep.room.controller.pos);
                }
                creep.moveByPath(creep.memory.currentPath);
            }

            if (creep.carry.energy == 0)
            {
                creep.memory.currentState = STATE.HARVEST;
            }
        }


    }
};

module.exports = roleUpgrader;