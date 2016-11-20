/**
 * Created by gerson on 11/11/2016.
 */
var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var sinon = require('sinon');
var StateHarvest = require('./../dist/state.harvest.js');
require('D:\\Devl\\Workspace\\screeps-sim\\ScreepsAutocomplete-master\\Creep.js');
require('D:\\Devl\\Workspace\\screeps-sim\\ScreepsAutocomplete-master\\Game.js');
require('D:\\Devl\\Workspace\\screeps-sim\\ScreepsAutocomplete-master\\Source.js');
require('D:\\Devl\\Workspace\\screeps-sim\\ScreepsAutocomplete-master\\Room.js');

const ERR_NOT_IN_RANGE = -9;



describe('state.harvester', function (){
    it('if creep has source and has energy lower than 70% energy capacity it should call harvest, if not in range should call move', function(){
        var stateHarvest = new StateHarvest();
        var creep = new Creep();
        var GameMock = sinon.mock(Game);
        var source = sinon.mock(new Source());
        var room = Object.create(Room.prototype);
        var roomMock = sinon.mock(room);
        var creepMock = sinon.mock(creep);

        creep.carry = {};
        creep.carry.energy = 50;
        creep.carryCapacity = 100;
        creep.memory = {};
        creep.memory.currentSource = 'aaaaaa'; //id
        creep.room = room;
        creep.pos = {"x":15,"y":5,"roomName":"E38N43"};
        source.pos = {"x":13,"y":10,"roomName":"E38N43"};

        creepMock.expects('harvest').withArgs(source).returns(ERR_NOT_IN_RANGE);
        roomMock.expects('findPath').withArgs(creep.pos, source.pos).returns({});
        creepMock.expects('moveByPath').withArgs({}).returns(true);
        GameMock.expects('getObjectById').withArgs(creep.memory.currentSource).returns(source);

        stateHarvest.doStateStrategy(creep);

        creepMock.restore();
        GameMock.restore();
        source.restore();
        roomMock.verify();
        creepMock.verify();
        GameMock.verify();
        source.verify();
        roomMock.restore();
    })
});


