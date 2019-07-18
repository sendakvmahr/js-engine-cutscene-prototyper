define(["scene/Script", "physics/Vector", "lib/goody", "scene/Scene", "map/Map" , "entities/Cursor", "physics/CollisionHandler", "display/MapCamera", "entities/CameraEntity"],
function(Script, Vector, goody, Scene, Map, Cursor, CollisionHandler, MapCamera, CameraEntity) 
{    
    CutScene.prototype = new Scene.Scene();
    CutScene.prototype.constructor = CutScene;


    function CutScene(ctx, map, directionsJson) {
        this.map = new Map.Map(map);
        this.cursor = new Cursor.Cursor();
        this.cameraFollow = new CameraEntity.CameraEntity();
		
		var objects = this.map.objects;
		for (var i = 0; i < objects.length; i++) {
            if (objects[i].name === "MCSpawn") {
                this.cameraFollow.setPosition(objects[i].x, objects[i].y);
			}
		}
        this.loadEntities();
        this.collisionHandler = new CollisionHandler.CollisionHandler();
        this.camera = new MapCamera.MapCamera(ctx);
        this.camera.loadMap(this.map);
        this.script = new Script.Script(directionsJson);
    }

    CutScene.prototype.loadEntities = function() {
        this._entities = this.map.objects;
        this._events = this.map.eventMap;
    }

    CutScene.prototype.update = function(input, delta) {
        this.cursor.update(input);
        this.script.update(delta);
    }

    CutScene.prototype.click = function(mousePosition) {
        //this.camera.reloadMap(this.map); // do this more efficiently haha
    }

    CutScene.prototype.rightClick = function(mousePosition) {
    }

    CutScene.prototype.display = function() {
        this.camera.display(this.cameraFollow, this.cursor, []);
        this.script.display(this.camera._ctx);//!!
    }

    CutScene.prototype.nextScene = function() {
        // Should depends on the map and a few other things
        if (!this.switchScenes) {
            throw new Error("switchScenes is false");
        }
    }
    return {
        CutScene: CutScene
    };
});