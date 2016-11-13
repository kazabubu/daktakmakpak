/**
 * Created by or on 11/11/2016.
 */

class InterruptingStates {

    constructor() {
        this.interruptingStates = [];
    }

    registerInterruptingState(state){
        this.interruptingStates.push(state);
    }

    getInterruptingStates() {
        return this.interruptingStates;
    }

}

InterruptingStatesHolder = new InterruptingStates();

module.exports = InterruptingStatesHolder;