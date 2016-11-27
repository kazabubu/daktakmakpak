"use strict";
/**
 * Created by or on 27/11/2016.
 */
var upgraders = ['Upgrader1','Upgrader2'];
var ROOM = 'E38N43';
class AutoSpawn {



    spawn(){
        if (Game.rooms[ROOM].energyAvailable >= 1650 && (!_.isUndefined(Memory.dyingCount) && Memory.dyingCount[ROOM].count < 3 )){
            for(var upgrader in upgraders){
                if((_.isUndefined(Game.creeps[upgrader]) || Game.creeps[upgrader].ticksToLive <= 0) && Game.rooms[ROOM].energyAvailable >= 1650) {
                    Game.spawns['Spawn1'].createCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE]
                        ,upgrader,{role:'upgrader'});
                }
            }
        }

    }

}

module.exports = new AutoSpawn();
