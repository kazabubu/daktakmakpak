var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var prevPos = creep.memory.prevPos;
        creep.memory.prevPos = creep.pos;
        if (prevPos == creep.pos)
        {
            creep.memory.currentPath = null;
        }

        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1]);
            }
        }
        else if (creep.carry.energy == creep.carryCapacity) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                if (typeof variable == 'undefined') {
                    creep.memory.currentPath = creep.room.findPath(creep.pos ,creep.room.controller.pos);
                }
                creep.moveByPath(creep.memory.currentPath);
            }
        }
    }
};

module.exports = roleUpgrader;