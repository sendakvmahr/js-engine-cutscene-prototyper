define(["physics/Vector", "lib/goody", "scene/Scene", "map/Map" , "entities/Cursor", "physics/CollisionHandler", "display/MapCamera"],
function(Vector, goody, Scene, Map, Cursor, CollisionHandler, MapCamera) 
{    
    CutScene.prototype = new Scene.Scene();
    CutScene.prototype.constructor = CutScene;


    function CutScene(ctx, dir) {
    	// there this should take a directory with three objects in it. 
    	// first is the json that defines where everything STARTS in the scene
    	// second is the list of assets used in the scene (including tilesets and sprite portraits
    	// third should be the directions for the stuff actually used in the scene. 
        this.map = new Map.Map(dir + "/jsmap.json");
        this.cursor = new Cursor.Cursor();
		
		var objects = this.map.objects;
		for (var i = 0; i < objects.length; i++) {
            if (objects[i].name === "MCSpawn") {
				this.MC.setPosition(objects[i].x, objects[i].y);
			}
		}
        this.loadEntities();
        this.collisionHandler = new CollisionHandler.CollisionHandler();
        this.camera = new MapCamera.MapCamera(ctx);
        this.camera.loadMap(this.map);
        this._elementCap = 6; // should be in some global state variable
    }


}