var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var preLoopSetup = require('preLoopSetup');
var tower = require('tower');
var autoSpawn = require('autoSpawn');
var roleSimpleAttacker = require('role.simpleAttacker');
var roleSimpleClaimer = require('role.simpleClaimer');
var roleBuilderInter = require('role.builderInter');

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
        if(creep.memory.role == 'simpleClaimer') {
            roleSimpleClaimer.run(creep);
        }
        if(creep.memory.role == 'builderInter') {
            roleBuilderInter.run(creep);
        }
    }

    var currTower = Game.getObjectById('5822683165594bbb2c7a942a');
    tower.searchAndAttack(currTower);

    currTower = Game.getObjectById('5837786491b669792e2f67d5');
    tower.searchAndAttack(currTower);

    currTower = Game.getObjectById('58471a2d148d873a48eeffb1');
    tower.searchAndAttack(currTower);

    autoSpawn.spawn();

}