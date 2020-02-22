define(["lib/goody", "physics/Vector", "assets/vars"],
function(goody, Vector, vars)
{    
    function Map(json, tilesets) {
        // This pretty much shuold be redone for each game, make it a base for a top down since that is the demo
        // should be very basic - collision flags layer and maybe visual layers
        // redo the whole thing, THEN document it
        this.height = parseInt(json.height);
        this.width = parseInt(json.width);
        this.pixelWidth = this.width * vars.tileDimension;
        this.pixelHeight = this.height * vars.tileDimension;
        this.length = json.layers["Map1"].length;
        this.displayedLayers = 1;   // for now, unsure, but there are 3 BG layers
        this.parallax = false;
        this.tileset = {};
        this.tilesetInfo = [];
        var tilecount = 0;
        for (var i = 0; i < tilesets.length; i++) {
            var name = tilesets[i].name;
            tilecount += parseInt(tilesets[i].tilecount);
            this.tileset[name] = tilesets[i];
            this.tilesetInfo.push([tilecount, name]);
        }
        console.log(this);
        // Layers of the map, used for display
        this.imageMap = [];
        this.effectMap = [];
        this.parallaxMap = [];
        // Objects, not really used atm
        this.objects = [];
        this.eventMap = [];
        this.collisionMap = [];

        var layers = json.layers;
        var items = Object.keys(layers);
        for (var i = 0; i < items.length; i++) {
            var name = items[i];

            // Tile layer that's rendered
            if (goody.stringContains(name, "Map")) {
                this.imageMap.push(layers[name]);
            }
            else if (goody.stringContains(name, "P")) {
                this.parallaxMap.push(layers[name]);
                this.parallax = true;
            }
            // Height map
            else if (name === "Collision") {
                this.collisionMap = layers[name];
            }
            // Unused atm
            else if (name === "Entity") {
                this.objects = layers[i].objects;
            }
            // Events
            else if (name === "Events") {
                this.eventMap = layers[name];
            }
        }
    }

    Map.prototype.findRow = function(tileNumber) {
        return Math.floor(tileNumber / this.width);
    }
    Map.prototype.findColumn = function(tileNumber) {
        return tileNumber % this.width; 
    }

    
    Map.prototype.getHeight = function(tileIndex) {
        return this.heightMap[tileIndex];
    }

    Map.prototype.pixelToTile = function(point) {
        var column =  Math.floor(point.x/vars.tileDimension);
        var row = Math.floor(point.y/vars.tileDimension);
        return row * this.width + column;
    }
    
    Map.prototype.tileToPixel = function(tileNumber) { 
        return new Vector.Vector(tileNumber%this.width * vars.tileDimension, 
            Math.floor(tileNumber/this.width) * vars.tileDimension); 
    };
        
    return {
        Map: Map
    };
});