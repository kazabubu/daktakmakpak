class preLoopSetup {
    static setup() {
        if(typeof Memory.dyingCount == 'undefined' || (Game.time - Memory.dyingCount['E38N43'].lastUpdate > 30)){
            Memory.dyingCount = {"E38N43" : {"count" : 0, "lastUpdate" : 0}};
        }
    }

}

module.exports = preLoopSetup;