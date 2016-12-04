"use strict";
/**
 * Created by or on 04/11/2016.
 */
const ROOM_HOME = 'E38N43';
const NEW_ROOM = 'E38N44';

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



        if (creep.ticksToLive < 150 && creep.memory.currentState !== STATE.DIEING)
        {
            creep.memory.currentState = STATE.DIEING;
            creep.memory.renewCount = 0;
        }

        if (creep.memory.currentState == STATE.DIEING){
            creep.memory.renewCount += 1;
            var spawns = Game.rooms[ROOM_HOME].find(FIND_STRUCTURES, {
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

        if(creep.carry.energy < creep.carryCapacity && creep.memory.currentState == STATE.HARVEST) {
            var targets;
            var storage = Game.getObjectById('582dbc756fba2bb555a17156');
            if (!_.isUndefined(storage) && storage.store.energy > 1000){
                targets = [storage];
            }


            if (_.isUndefined(targets)) {
                targets = Game.rooms[ROOM_HOME].find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_CONTAINER)
                            && (!!structure.energy && structure.energy > (structure.energyCapacity * 0.3)) ||
                            (!!structure.store && structure.store.energy > (structure.storeCapacity * 0.3))
                        );
                    }
                });
            }
            if (targets && targets.length > 0) {
                if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }

            if (creep.carry.energy == creep.carryCapacity ){
                creep.memory.currentState = STATE.MOVING;
            }

        }else if ((creep.carry.energy == creep.carryCapacity && creep.room.name == ROOM_HOME) || creep.memory.currentState == STATE.MOVING){
            creep.memory.currentState = STATE.MOVING;
            if (!creep.pos.inRangeTo(Game.flags['Flag1'].pos, 1)) {
                var result = creep.moveTo(Game.flags['Flag1'], {noPathFinding: true});
                if (result == ERR_NO_PATH || result == ERR_NOT_FOUND){
                    creep.moveTo(Game.flags['Flag1']);
                }

            }
            else {
                creep.memory.currentPath = null;
                creep.memory.currentTarget = null;
                creep.memory.currentState = STATE.BUILD;
            }
        }
        else if (creep.carry.energy == creep.carryCapacity || creep.memory.currentState == STATE.BUILD) {
            if (creep.room.name == NEW_ROOM) {
                creep.memory.currentState = STATE.BUILD;
                var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

                if (target) {
                    var result = creep.build(target);
                    if (result == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else {
                    creep.memory.currentTarget = null;
                }

                if (creep.carry.energy == 0) {
                    creep.memory.currentState = STATE.HARVEST;
                }
            }else {
                creep.memory.currentState = STATE.MOVING;
            }
        }
    }
};

module.exports = roleBuilder;