/**
 * Created by gerson on 11/8/2016.
 */
const name = 'HARVEST';
class StateHarvest extends State {

    initSwitch(creep) {

    }

    doStateStrategy(creep){
        if(creep.carry.energy <= (creep.carryCapacity * 0.7))
        {
            if (creep.memory.currentSource) {
                var source = Game.getObjectById(creep.memory.currentSource);
            }
            if (!creep.memory.currentSource && !creep.memory.currentResource) {
                var droppedResources = creep.room.find(FIND_DROPPED_RESOURCES);
                if (!!droppedResources && droppedResources.length > 0) {
                    creep.memory.currentResource = droppedResources[0].id;
                }
                else {
                    var sources = creep.room.find(FIND_SOURCES);
                    if (sources) {
                        creep.memory.currentSource = sources[creep.ticksToLive % sources.length].id;
                    }
                    //creep.memory.currentSource = getSourceToMine(creep);
                }
            }

            if (!!creep.memory.currentResource){
                var currentResource = Game.getObjectById(creep.memory.currentResource);
                if (creep.pickup(currentResource) == ERR_NOT_IN_RANGE) {
                    if (!creep.memory.currentPath){
                        creep.memory.currentPath = creep.room.findPath(creep.pos, currentResource.pos);
                    }
                    creep.moveByPath(creep.memory.currentPath);
                }
                else {
                    creep.memory.currentResource = null;
                    creep.memory.currentPath = null;
                }
            }


            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                if (!creep.memory.currentPath){
                    source = Game.getObjectById(creep.memory.currentSource);
                    creep.memory.currentPath = creep.room.findPath(creep.pos , source.pos);
                }

                creep.moveByPath(creep.memory.currentPath);
            }
        }
        else {
            var statePrototype = StateSwitcher.getStateByName(TRANSFER);
            StateSwitcher.switchState(creep, statePrototype);
        }

    }
}