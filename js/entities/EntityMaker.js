define([
	"entities/Entity", 
	"entities/GreenEntity",
	"entities/Cursor"
	],
function(
	Entity, 
	GreenEntity, 
	Cursor)
{    
    function EntityMaker(entityName, entityLocation) {
	switch(entityName) {
		case "Entity":
			return new Entity.Entity(entityLocation.x, entityLocation.y)
		case "GreenEntity":
			return new GreenEntity.GreenEntity(entityLocation.x, entityLocation.y)
		case "Cursor":
			return new Cursor.Cursor(entityLocation.x, entityLocation.y)
		default:
			return new Entity.Entity(entityLocation.x, entityLocation.y)
		} 
    }
                
    return EntityMaker;
});