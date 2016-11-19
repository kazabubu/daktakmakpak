var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const STATE = {
            UPGRADE: 'Upgrade',
            DIEING: 'Dieing',
            TRANSFER: 'TRANSFER'
        };

        const DEFAULT_STATE = STATE.TRANSFER;

        var disable = false;
        if (!_.isUndefined(Memory.dyingCount[creep.room.name]) && Memory.dyingCount[creep.room.name].count >= 3) {
            disable = true
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

        if(creep.carry.energy < creep.carryCapacity && creep.memory.currentState == STATE.TRANSFER && !disable) {
            var targets;
            if (creep.room.name == 'E38N43'){
                var storage = Game.getObjectById('582dbc756fba2bb555a17156');
                if (!_.isUndefined(storage) && storage.store.energy > 1000){
                    targets = [storage];
                }
            }

            if (_.isUndefined(targets)) {
                targets = creep.room.find(FIND_STRUCTURES, {
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

            if (targets && targets.length > 0)
                if(creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
        }
        else if (creep.carry.energy == creep.carryCapacity || creep.memory.currentState == STATE.UPGRADE) {
            creep.memory.currentState = STATE.UPGRADE;
            if (!creep.memory.currentPath) {
                creep.memory.currentPath = creep.room.findPath(creep.pos ,creep.room.controller.pos);
            }

            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveByPath(creep.memory.currentPath);
            }

            if (creep.carry.energy == 0)
            {
                creep.memory.currentState = STATE.TRANSFER;
            }
        }


    }
};

module.exports = roleUpgrader;