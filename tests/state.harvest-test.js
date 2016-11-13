/**
 * Created by gerson on 11/11/2016.
 */
var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var sinon = require('sinon');
var StateHarvest = require('./../dist/state.harvest.js');
var Creep = require('D:\\Devl\\Workspace\\screeps-sim\\ScreepsAutocomplete-master\\Creep.js');
var Game = require('D:\\Devl\\Workspace\\screeps-sim\\ScreepsAutocomplete-master\\Game.js');
var Source = require('D:\\Devl\\Workspace\\screeps-sim\\ScreepsAutocomplete-master\\Source.js');
var Room = require('D:\\Devl\\Workspace\\screeps-sim\\ScreepsAutocomplete-master\\Room.js');


describe('state.harvester', function (){
    it('if creep has source and has energy lower than 70% energy capacity it should call harvest, if not in range should call move', function(){
        var stateHarvest = new StateHarvest();
        var creep = sinon.mock(Creep);
        var Game = sinon.mock(Game);
        var source = sinon.mock(Source.prototype);
        var room = sinon.mock(Room.prototype);

        creep.carry = {};
        creep.carry.energy = 50;
        creep.carry.energyCapacity = 100;
        creep.memory = {};
        creep.memory.currentSource = 'aaaaaa'; //id
        creep.room = room;
        creep.pos = {"x":15,"y":5,"roomName":"E38N43"};
        source.pos = {"x":13,"y":10,"roomName":"E38N43"};

        creep.expects('harvest').withArgs(source).returns(ERR_NOT_IN_RANGE);
        room.expects('findPath').withArgs(creep.pos, source.pos).returns({});
        creep.expects('moveByPath').withArgs({}).returns(true);
        Game.expects('getObjectById').withArgs(creep.memory.currentSource).returns(source);

        stateHarvest.doStateStrategy(creep);

        creep.restore();
        Game.restore();
        source.restore();
        room.restore();
        creep.verify();
        Game.verify();
        source.verify();
        room.restore();
    })
});
