
var tower = {

    searchAndAttack: function(tower) {
        if(tower) {
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }

            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                var roomName = 'E38N43';
                var username = closestHostile.owner.username;
                Game.notify(`User ${username} spotted in room ${roomName}`);
                tower.attack(closestHostile);
            }
        }
    }
};

module.exports = tower;