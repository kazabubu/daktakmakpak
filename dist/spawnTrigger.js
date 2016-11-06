/**
 * Created by or on 06/11/2016.
 */
class SpawnTrigger
{
    createTriggers()
    {
        //this.triggerTransferFromContainer();
    }

    triggerTransferFromContainer()
    {
        for(spawn in Game.spawns)
        {
            if(spawn.energy < 0.3 * (spawn.energyCapacity))
            {
                if(!this.containers || !this.containers[spawn.id]) {
                   var containers = spawn.room.find(FIND_STRUCTURES, {
                           filter: (structure) => {
                               return ( structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > 0.1 * structure.storeCapacity);
                           }
                       }
                   ).sort(function(a,b){return a.store.energy - b.store.energy});
                   this.containers = !this.containers ? {} : this.containers;
                   this.containers[spawn.id] = containers.map(container => container.id);
                }
            }
        }
    }
}
