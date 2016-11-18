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
        if (_.isUndefined(Memory.dyingCount['E38N43'])) {
            Memory.dyingCount['E38N43'] = {};
        }
        Memory.dyingCount['E38N43'].count = dyingCount;
    }
}

module.exports = preLoopSetup;