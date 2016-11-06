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
            creep.memory.renewCount = 0;
        }

        if (creep.memory.currentState == STATE.DIEING){
            creep.memory.renewCount += 1;
            var spawns = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN)}});
            if (spawns[0].renewCreep(creep) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawns[0]);
            }

            if (creep.ticksToLive > 1300 || creep.memory.renewCount > 20)
            {
                creep.memory.currentState = DEFAULT_STATE;
            }
        }
        if (typeof creep.memory.currentState == 'undefined')
        {
            creep.memory.currentState = STATE.HARVEST;
        }

        var prevPos = creep.memory.prevPos;
        if (!creep.memory.prevPos){
            creep.memory.prevPos = {};
        }
        creep.memory.prevPos.x = creep.pos.x;
        creep.memory.prevPos.y = creep.pos.y;

        if (!creep.memory.prevPos.count)
        {
            creep.memory.prevPos.count = 1;
        }
        else {
            creep.memory.prevPos.count += 1;
        }

        if (prevPos && creep.pos.isEqualTo(prevPos.x, prevPos.y) && creep.memory.prevPos.count > 1)
        {
            creep.memory.currentPath = null;
            creep.memory.currentSource = null;
            creep.memory.prevPos = null;
            creep.memory.currentResource = null;
        }

        if(creep.carry.energy < creep.carryCapacity && creep.memory.currentState == STATE.HARVEST) {
            if (creep.memory.currentSource) {
                var source = Game.getObjectById(creep.memory.currentSource);
            }
            if (!creep.memory.currentSource && !creep.memory.currentResource) {
                var droppedResources = creep.room.find(FIND_DROPPED_RESOURCES);
                if (!!droppedResources) {
                    creep.memory.currentResource = droppedResources[0].id;
                }
                else {
                    var sources = creep.room.find(FIND_SOURCES);
                    if (sources) {
                        creep.memory.currentSource = sources[creep.ticksToLive % sources.length].id;
                    }
                }
            }

            if (!!creep.memory.currentResource){
                var currentResource = Game.getObjectById(creep.memory.currentResource);
                if (creep.pickup(currentResource) == ERR_NOT_IN_RANGE) {
                    if (!creep.memory.currentPath){
                        creep.memory.currentPath = creep.room.findPath(creep.pos, currentResource.pos);
                    }
                    creep.moveByPath(creep.memory.currentPath);
                }
                else {
                    creep.memory.currentResource = null;
                    creep.memory.currentPath = null;
                }
            }




            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                if (!creep.memory.currentPath){
                    source = Game.getObjectById(creep.memory.currentSource);
                    creep.memory.currentPath = creep.room.findPath(creep.pos , source.pos);
                }

                creep.moveByPath(creep.memory.currentPath);
            }

        }
        else if (creep.carry.energy == creep.carryCapacity || creep.memory.currentState == STATE.TRANSFER) {
            creep.memory.currentState = STATE.TRANSFER;
            if (!creep.memory.currentTarget) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                           // structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_TOWER) && ((!!structure.energy && structure.energy < structure.energyCapacity) ||
                            (!!structure.store && structure.store.energy < structure.storeCapacity));
                    }
                });
                creep.memory.currentTarget = targets.length > 0 ? targets[0].id : null;
            }

            if(!!creep.memory.currentTarget) {
                var currTarget = Game.getObjectById(creep.memory.currentTarget);
                if(creep.transfer(currTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(currTarget);
                }
            }

            if (creep.carry.energy == 0)
            {
                creep.memory.currentState = STATE.HARVEST;
                creep.memory.currentPath = null;
                creep.memory.currentSource = null;
                creep.memory.prevPos = null;
                creep.memory.currentResource = null;
            }
        }

        function getSourceToMine()
        {

        }

        function setupMiningCount()
        {
            if(!Memory.miningCount[creep.room.name])
            {
                if (!Memory.miningCount) {
                    Memory.miningCount = {};
                }
            }
        }

    }
};

module.exports = roleHarvester;