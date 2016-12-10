"use strict";
var roleHarvester = {

    structurePrioratyCompare: function (a, b) {
        const STRUCT_PRIORITY = {
            STRUCTURE_TOWER: 100,
            STRUCTURE_SPAWN: 99,
            STRUCTURE_EXTENSION: 98,
            STRUCTURE_STORAGE: 97,
            STRUCTURE_CONTAINER: 96
        }

        var aPriority = _.isUndefined(STRUCT_PRIORITY[a.structureType]) ? 0 : STRUCT_PRIORITY[a.structureType];
        var bPriority = _.isUndefined(STRUCT_PRIORITY[b.structureType]) ? 0 : STRUCT_PRIORITY[b.structureType];

        if (aPriority < bPriority) {
            return -1;
        }
        if (aPriority > bPriority) {
            return 1;
        }
        return 0;
    },

    /** @param {Creep} creep **/
    run: function(creep) {

        const STATE = {
            HARVEST: 'Harvest',
            DIEING: 'Dieing',
            TRANSFER: 'TRANSFER'
        };

        const DEFAULT_STATE = STATE.HARVEST;
        const DEFAULT_ROOM = 'E38N43'; //creep.memory.homeRoom

        if (_.isUndefined(creep.memory.homeRoom) || !creep.memory.homeRoom){
            creep.memory.homeRoom = DEFAULT_ROOM;
        }

        if (creep.ticksToLive < 150 && creep.memory.currentState !== STATE.DIEING)
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
            else if (creep.carry.energy > 0 ){
                creep.transfer(spawns[0], RESOURCE_ENERGY);
            }

            if (creep.ticksToLive > 1300 || creep.memory.renewCount > 30)
            {
                creep.memory.currentState = DEFAULT_STATE;
                creep.memory.renewCount = 0;
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
        else if(prevPos && creep.pos.isEqualTo(prevPos.x, prevPos.y)){
            creep.memory.prevPos.count += 1;
        }

        if (prevPos && creep.pos.isEqualTo(prevPos.x, prevPos.y) && creep.memory.prevPos.count > 3 && creep.memory.currentState !== STATE.DIEING)
        {
            creep.memory.currentPath = null;
            creep.memory.currentSource = null;
            creep.memory.prevPos = null;
            creep.memory.currentResource = null;
            creep.memory.currentTarget = null;
        }

        var currTotal = 0;
        currTotal = getCurrTotalCarried(creep);

        if (currTotal < creep.carryCapacity && creep.memory.currentState == STATE.HARVEST && creep.room.name != creep.memory.homeRoom){
            if (!creep.pos.inRangeTo(Game.flags['Flag1'].pos, 1)) {
                var result = creep.moveTo(Game.flags['Flag1'], {noPathFinding: true});
                if (result == ERR_NO_PATH || result == ERR_NOT_FOUND){
                    creep.moveTo(Game.flags['Flag1']);
                }

            }
        }
        else if(currTotal < creep.carryCapacity && creep.memory.currentState == STATE.HARVEST && creep.room.name == creep.memory.homeRoom) {
            if (creep.memory.currentSource) {
                var source = Game.getObjectById(creep.memory.currentSource);
            }
            if (!creep.memory.currentSource && !creep.memory.currentResource) {
                var droppedResources = creep.room.find(FIND_DROPPED_RESOURCES);
                if (!!droppedResources && droppedResources.length > 0) {
                    creep.memory.currentResource = droppedResources[0].id;
                }
                else {
                    var sources = creep.room.find(FIND_SOURCES);
                    if (sources && sources.length > 0 && typeof creep.ticksToLive != "undefined") {                        
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
                    creep.memory.currentPath = creep.room.findPath(creep.pos , source.pos, {"maxRooms" : 1});
                }

                creep.moveByPath(creep.memory.currentPath);
            }


            currTotal = getCurrTotalCarried(creep);

            if (currTotal == creep.carryCapacity)
            {
                creep.memory.currentState = STATE.TRANSFER;
            }

        }
        else if (currTotal == creep.carryCapacity || creep.memory.currentState == STATE.TRANSFER) {
            creep.memory.currentState = STATE.TRANSFER;
            if (!creep.memory.currentTarget) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_STORAGE ||
                            structure.structureType == STRUCTURE_TOWER) && ((typeof structure.energy !== 'undefined' && structure.energy < structure.energyCapacity) ||
                            (typeof structure.store !== 'undefined' && structure.store.energy < structure.storeCapacity));
                    }
                });

                // sorting descending order by priority
                 targets.sort(function (a, b) {
                    var STRUCT_PRIORITY = {
                        [STRUCTURE_SPAWN]: 100,
                        [STRUCTURE_TOWER]: 99,
                        [STRUCTURE_EXTENSION]: 98,
                        [STRUCTURE_STORAGE]: 97,
                        [STRUCTURE_CONTAINER]: 96
                    }


                    var aPriority = _.isUndefined(STRUCT_PRIORITY[a.structureType]) ? 0 : STRUCT_PRIORITY[a.structureType];
                    var bPriority = _.isUndefined(STRUCT_PRIORITY[b.structureType]) ? 0 : STRUCT_PRIORITY[b.structureType];

                    if (aPriority > bPriority) {
                        return -1;
                    }
                    if (aPriority < bPriority) {
                        return 1;
                    }
                    return 0;
                });

                creep.memory.currentTarget = targets.length > 0 ? targets[0].id : null;
            }

            if(!!creep.memory.currentTarget) {
                var currTarget = Game.getObjectById(creep.memory.currentTarget);
                if (currTarget.structureType == STRUCTURE_CONTAINER){
                    for(var resourceType in creep.carry) {
                        creep.transfer(currTarget, resourceType);
                    }
                }
                else if(creep.transfer(currTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(currTarget);
                }
                else {
                    creep.memory.currentTarget = null;
                    creep.memory.currentPath = null;
                }
            }
            currTotal = getCurrTotalCarried(creep);

            if (currTotal < (creep.carryCapacity * 0.2 ))
            {
                creep.memory.currentState = STATE.HARVEST;
                creep.memory.currentPath = null;
                creep.memory.currentSource = null;
                creep.memory.prevPos = null;
                creep.memory.currentResource = null;
            }
        }

        function getCurrTotalCarried(creep){
            var currTotal = 0;
            for(var resourceType in creep.carry) {
                currTotal += creep.carry[resourceType];
            }
            return currTotal;
        }

        function getSourceToMine(creep)
        {
            var sourceId = null;
            setupMiningCount(creep);
            if (!!Memory.miningCount[creep.room.name]) {
                var minSource = Memory.miningCount[creep.room.name].reduce(function (a, b) {
                    return (a.count < b.count ? a : b);
                });
                minSource.count++;
                sourceId = minSource.sourceId;
            }
            return sourceId;
        }

        function setupMiningCount(creep)
        {
            if(!Memory.miningCount || !Memory.miningCount[creep.room.name])
            {
                if (!Memory.miningCount) {
                    Memory.miningCount = {};
                }
                var sources = creep.room.find(FIND_SOURCES);
                if (sources) {
                    Memory.miningCount[creep.room.name] = creep.room.find(FIND_SOURCES).map(source => ({
                        sourceId: source.id,
                        count: 0
                    }));
                }
            }
        }

    }
};

module.exports = roleHarvester;