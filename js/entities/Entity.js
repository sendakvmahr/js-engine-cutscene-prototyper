/*
Base class for all entities
*/
define(["lib/goody", "physics/Vector", "physics/Rect"],
function(goody, Vector, Rect)
{    
    function Entity(x, y, z) {       
        this.velocity = new Vector.Vector(0, 0); 
        this.rect = new Rect.Rect(x, y, 1, 1);
    }
    
    return {
        Entity:Entity
    };
});