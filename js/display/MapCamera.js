define(["physics/Vector", "lib/goody", "assets/vars"],
function(Vector, goody, vars)
{    
    function MapCamera(ctx) {
        this._offset = new Vector.Vector(0, 0); 
        this._buffer = [];
        this._ctx = ctx;
        this._mapPixelWidth = 0;
        this._mapPixelHeight = 0;
        this._mapLength = 0;
        this._follow = 0;
    }

    MapCamera.prototype.loadMap = function(map) {
        // Loads the buffer images for a map
        this._buffer = [];
        this._mapPixelWidth = map.pixelWidth;
        this._mapPixelHeight = map.pixelHeight;
        this._mapLength = map.length;
        // THIS WAS FFTP SPECIFIC, as each height element had both an effect layer and a base layer. 
        //but buffer length should be set anyways
        var bufferLength = map.displayedLayers;
        // Also FFTP specific, but useful in that this is base code for creating a parallax layer
        if (map.parallax) {
            this.renderParallaxLayer("intro_P0");
        }

        for (var i = 0; i < bufferLength; i += 2) {
            this.renderLayer(map.imageMap[i], map);
            //this.renderLayer(map.imageMap[Math.floor(i/2)], map, images.Tileset);
            //this.renderLayer(map.effectMap[Math.floor(i/2)], map, images.Tileset);
        }

        // Set font and color for debugging information
        this._ctx.font = "20px sans-serif";
        this._ctx.fillStyle = "#FF0000";
    }

    MapCamera.prototype.reloadMap = function(map) {
        // parallax, parallax, bg0, ef0, bg1, ef1, bg2, ef2
        // 0         1         2    3    4    5    6    7
        var bufferLength = this._buffer.length;
        for (var i = (map.parallax ? 2 : 0); i < bufferLength; i += 2) {
            var layerNumber = i + 1;
            var layer = map.effectMap[i/2 - (map.parallax ? 1 : 0)];
            // console.log(i/2 - (map.parallax ? 1 : 0), layerNumber);
            var ctx = this._buffer[layerNumber].getContext("2d");
            ctx.clearRect (0, 0, map.pixelHeight, map.pixelWidth);
           for (var n = 0; n < this._mapLength; n++) {
               this.renderTile(n, layer[n], map, ctx);
           }
        }
    }

    MapCamera.prototype.renderParallaxLayer = function(parallaxImage) {
        // As of now, parallax cannot move, and the buffer is the size of
        //  the map, not forced to be the same size as the camera
        var i = this._buffer.length;
        this._buffer.push(document.createElement("canvas"));
        this._buffer[i].width = this._mapPixelWidth;
        this._buffer[i].height = this._mapPixelHeight;
        var ctx = this._buffer[i].getContext("2d");
        var image = images[parallaxImage];
        ctx.drawImage(
            image,                                                   //image
            0,                                                       //x position on image
            0,                                                       //y position on image
            image.width,                                             //imageWidth on Source
            image.height,                                            //imageHeight on Source
            0,                                                       //xPosCanvas    
            0,                                                       //yPosCanvas    
            image.width,                                             //imageWidth on Canvas
            image.height                                             //imageHeight on Canvas                
        );
    
    }

    MapCamera.prototype.renderLayer = function(layer, map, image) {
        // makes a context for the layer given, renders all the tiles on the context,
        // and adds it to the camera buffer.  
        var i = this._buffer.length;
        this._buffer.push(document.createElement("canvas"));
        this._buffer[i].width = this._mapPixelWidth;
        this._buffer[i].height = this._mapPixelHeight;
        var ctx = this._buffer[i].getContext("2d");
        for (var n = 0; n < this._mapLength; n++) {
            this.renderTile(n, layer[n], map, ctx, image);
        }
    }

    MapCamera.prototype.assignEnity = entity => this._follow = (entity !== undefined) ? entity : 0;
    
    MapCamera.prototype._calcOffset = function() {
        // Calculates the displacement of the map 
        if (this._follow === 0) { return; }
        var cwidth = vars.displayWidth;
        var cheight = vars.displayHeight;
        var MCpos = MC.rect.position;
        if (this._mapPixelWidth <= cwidth) {
            this._offset.x = (cwidth - this._mapPixelWidth)/2;
        } else {
            this._offset.x = Math.floor(goody.cap(cwidth / 2 - MCpos.x, -this._mapPixelWidth + cwidth, 0));        
        }
        if (this._mapPixelHeight <= cheight) {
            this._offset.y = (cheight - this._mapPixelHeight)/2;
        } else {
            this._offset.y = Math.floor(goody.cap(cwidth / 2 - MCpos.x, -this._mapPixelHeight + cheight, 0));        
        }
    };

    MapCamera.prototype.showString = function(string, y) {
        // Displays a string on the upper left corner of the canvas
        // Put an HTML debug menu later
        this._ctx.fillText(string, 10, y);
    }

    MapCamera.prototype.display = function(cameraEntity, MC, cursor, objects) {
        // Displays the map, MainChar, cursor, and any additional Entity objects
        // right now, does not handle any other entities besides MC
        this._calcOffset();
        var bufferLength = this._buffer.length;
        this._ctx.fillStyle = "black";
        this._ctx.fillRect(0, 0, canvas.width, canvas.height);



        for (var i = 0; i < bufferLength; i++) {
            this._ctx.drawImage(this._buffer[i], this._offset.x, this._offset.y);
            // make better z axis rendering for the main character and other entities
            if (i == bufferLength) {
                MCdrawn = true;
            }
        }
    }

    MapCamera.prototype.absolutePosition = function(canvasPosition) {
        return new Vector.Vector(canvasPosition.x - this._offset.x, canvasPosition.y - this._offset.y);
    }
    
    MapCamera.prototype.renderTile = function(i, tile, map, ctx) {    
        // Most likely a lot of this has to change once I get the main tileset...
        // this is a lot of magic numbers due to FFtP's strangely giaagantic tilesheet
        //if ( tile === 1 ) { return; }
        /*
        var image;
        if (tile <= 2377) {
            image = images.Tileset;
        }
        else {
            image = images.Tileset; // switch to other images, they don't exist yet
        } 
        */
        var dim = vars.tileDimension;
        var mapVector = map.tileToPixel(i);
        var tilesetinfo = map.tilesetInfo;
        var tiles = "";
        var tileOffset = 0;
        for (var n=0; n<tilesetinfo.length; n++) {
            if (tilesetinfo[n][0] > tile) {
                tiles = tilesetinfo[n][1];
                break;
            }
            tileOffset = tilesetinfo[n][0];
        }
        var tileset = map.tileset[tiles];

        // offset for the number and processing tiles
        //tile = tile - 13; 
        //for every tile:
        //    find the image it corresponds to
        var xpos = tile - tileOffset;
        var ypos = xpos;
        xpos = Math.floor((tile-1) % (tileset.width / dim)) * dim;
        ypos = Math.floor((tile-1) / (tileset.width / dim)) * dim;
//        var xpos = ((tile+1) % (image.width / dim)) * dim;    
  //      var ypos = Math.floor((tile-1) / (image.width / dim)) * dim; 
        ctx.drawImage(
            images[tiles],                                              //image
            xpos,                                                       //x position on image
            ypos,                                                       //y position on image
            dim,                                                        //imageWidth on Source
            dim,                                                        //imageHeight on Source
            mapVector.x,                                                //xPosCanvas    
            mapVector.y,                                                //yPosCanvas    
            dim,                                                        //imageWidth on Canvas
            dim                                                         //imageHeight on Canvas                
        );
    };
    
    return {
        MapCamera:MapCamera
    };
});