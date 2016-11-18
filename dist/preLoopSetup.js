"use strict";

const STATE = {
    HARVEST: 'Harvest',
    DIEING: 'Dieing',
    TRANSFER: 'TRANSFER'
};

class preLoopSetup {
    static setup() {
        preLoopSetup.dyingCount();
    }

    static dyingCount() {
        var dyingCount = 0;
        for(var name in Game.creeps) {
            if (Game.creeps[name].memory.currentState == STATE.DIEING) {
                dyingCount += 1;
            }
        }
        Memory.dyingCount = dyingCount;
    }
}

module.exports = preLoopSetup;