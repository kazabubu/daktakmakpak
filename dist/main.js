var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var preLoopSetup = require('preLoopSetup');
var tower = require('tower');
var autoSpawn = require('autoSpawn');
var roleSimpleAttacker = require('role.simpleAttacker');

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
        if(creep.memory.role == 'simpleAttacker'){
            roleSimpleAttacker.run(creep);
        }
    }

    var currTower = Game.getObjectById('5822683165594bbb2c7a942a');
    tower.searchAndAttack(currTower);

    currTower = Game.getObjectById('58377293465957f661f1188a');
    tower.searchAndAttack(currTower);

    autoSpawn.spawn();

}