var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var preLoopSetup = require('preLoopSetup');
var tower = require('tower');

module.exports.loop = function () {
    preLoopSetup.setup();
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }

    var currTower = Game.getObjectById('655c47591e87869f652f7c04');
    tower.searchAndAttack(currTower);

}