/**
 * Created by or on 04/11/2016.
 */
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        const STATE = {
            HARVEST: 'Harvest',
            DIEING: 'Dieing',
            BUILD: 'BUILD',
            FIX: 'FIX'
        };

        const DEFAULT_STATE = STATE.HARVEST;

        if (creep.ticksToLive < 150)
        {
            creep.memory.currentState = STATE.DIEING;
            creep.memory.renewCount = 0;
            Memory.dyingCount[creep.room.name].count += 1;
            Memory.dyingCount[creep.room.name].lastUpdate = Game.time;
        }

        if (creep.memory.currentState == STATE.DIEING){
            creep.memory.renewCount += 1;
            var spawns = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN)}});
            if (spawns[0].renewCreep(creep) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawns[0]);
            }
            else if (creep.carry.energy > 0 ){
                creep.transfer(spawns[0], RESOURCE_ENERGY);
            }

            if (creep.ticksToLive > 1300 || creep.memory.renewCount > 30)
            {
                creep.memory.currentState = DEFAULT_STATE;
                creep.memory.renewCount = 0;
                if (Memory.dyingCount[creep.room.name].count > 0) {
                    Memory.dyingCount[creep.room.name].count -= 1;
                    Memory.dyingCount[creep.room.name].lastUpdate = Game.time;
                }
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
            creep.memory.prevPos = null;
        }

        if(creep.carry.energy < creep.carryCapacity && creep.memory.currentState == STATE.HARVEST) {
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
        else if (creep.carry.energy == creep.carryCapacity || creep.memory.currentState == STATE.BUILD) {
            creep.memory.currentState = STATE.BUILD;
            var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

            if(target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else {
                creep.memory.currentState == STATE.FIX;
                creep.memory.currentTarget = null;
            }

            if (creep.carry.energy == 0)
            {
                creep.memory.currentState = STATE.HARVEST;
            }
        }

        if (creep.carry.energy == creep.carryCapacity || creep.memory.currentState == STATE.FIX) {
            creep.memory.currentState = STATE.FIX;
            if (!creep.memory.currentTarget){
                var target = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.hits <= (structure.hitsMax * 0.3))
                    }

                });

                creep.memory.currentTarget = target && target.length > 0 ? target[0].id : null;
            }

            if(creep.memory.currentTarget) {
                var currentTarget = Game.getObjectById(creep.memory.currentTarget);
                if (currentTarget != null && currentTarget.hits <= (currentTarget.hitsMax * 0.3))
                {
                    var result = creep.repair(currentTarget);
                    if(result == ERR_NOT_IN_RANGE) {
                        creep.moveTo(currentTarget);
                    }
                    else if(result !== OK){
                        creep.memory.currentTarget = null;
                    }
                }
                else
                {
                    creep.memory.currentState = STATE.BUILD;
                    creep.memory.currentTarget = null;
                }
            }
            else {
                creep.memory.currentState = STATE.BUILD;
            }

            if (creep.carry.energy == 0)
            {
                creep.memory.currentState = STATE.HARVEST;
            }
        }
    }
};

module.exports = roleBuilder;