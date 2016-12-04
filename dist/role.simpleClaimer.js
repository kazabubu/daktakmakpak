"use strict";
/**
 * Created by or on 28/11/2016.
 */

var roleSimpleClaimer = {
    run: function(creep) {

        const STATE = {
            MOVING: 'MOVING',
            DIEING: 'Dieing',
            ATTACKING: 'ATTACKING'
        };

        const DEFAULT_STATE = STATE.MOVING;

        if (typeof creep.memory.currentState == 'undefined')
        {
            creep.memory.currentState = DEFAULT_STATE;
        }


        /* if (creep.ticksToLive < 150 && creep.memory.currentState !== STATE.DIEING)
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
         }*/
        if (typeof creep.memory.currentState == 'undefined')
        {
            creep.memory.currentState = DEFAULT_STATE;
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


        if (creep.memory.currentState == STATE.MOVING){
            var hasRachedFlag = false;
            if (!creep.pos.inRangeTo(Game.flags['Flag1'].pos, 1)) {
                var result = creep.moveTo(Game.flags['Flag1'], {noPathFinding: true});
                if (result == ERR_NO_PATH || result == ERR_NOT_FOUND){
                    creep.moveTo(Game.flags['Flag1']);
                }

            }
            else {
                hasRachedFlag = true;
                creep.memory.currentPath = null;
                creep.memory.currentTarget = null;
                creep.memory.currentState = STATE.ATTACKING;
            }
        }
        else if (creep.memory.currentState == STATE.ATTACKING) {
            if (!creep.memory.currentTarget || !creep.memory.currentPath) {
                /*var targets = creep.room.find(FIND_STRUCTURES,{
                 filter: (structure) => {
                 return (structure.structureType == STRUCTURE_CONTROLLER);
                 }});

                 if (targets && targets.length > 0) {
                 creep.memory.currentTarget = targets[0].id;
                 creep.memory.currentPath = creep.room.findPath(creep.pos, targets[0].pos);
                 }*/
                creep.memory.currentTarget = '577b93e70f9d51615fa48d85';

                creep.memory.currentPath = creep.room.findPath(creep.pos, Game.getObjectById(creep.memory.currentTarget).pos);
            }
            var target = Game.getObjectById(creep.memory.currentTarget);

            var result = creep.claimController(target);
            if(result == ERR_NOT_IN_RANGE){
                creep.moveByPath(creep.memory.currentPath);
            }
        }
    }
};

module.exports = roleSimpleClaimer;