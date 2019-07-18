define(["display/Animation", "entities/Entity", "physics/Vector", "lib/goody", "assets/vars"],
function(Animation, Entity, Vector, goody, vars)
{    
    CameraEntity.prototype = new Entity.Entity();
    CameraEntity.prototype.constructor = CameraEntity;

    function CameraEntity(x, y, z) {
        Entity.Entity.apply(this, arguments);
        this._accel = 1.5;
        this._velCap = 3;
        this._friction = .7;
        this._floatOffset = 0;        // image offsets as a result of flying and sinking
        this._targetFloatOffset = 0;  // target image offset at min/max height

        this.rect.width = 21;
        this.rect.height = 27;
    }

    CameraEntity.prototype.setPosition = function(x, y) {
        this.rect.setLeft(x);
        this.rect.setTop(y);
    }

    CameraEntity.prototype.update = function(input, map, collisionHandler, timeDelta) {
        // this is entirely variable by game but this is not a bad defualt
        // if moving 
        if (input.up||input.down||input.right||input.left) {
            // TODO = Better orientation based on dx and dy
            if (input.up) {   
                this.velocity.y -= this._accel;
            }
            if (input.right) {
                this.velocity.x += this._accel;
            }
            if (input.down) {
                this.velocity.y += this._accel;
            }
            if (input.left) {
                this.velocity.x -= this._accel;
            }        
            if (this.velocity.length() > this._velCap) {
                this.velocity.setLength(this._velCap);
            }; 
        }
        else {
            this.velocity.mult(this._friction);
        }
        this._move(map, collisionHandler, timeDelta);
    }

    CameraEntity.prototype.drawImage = function(ctx, offset) {
    }
    
    CameraEntity.prototype._move = function(map, collisionHandler, timeDelta) {
        this.moveAxis("x", this.velocity.x * timeDelta/9, collisionHandler, map);
        this.moveAxis("y", this.velocity.y * timeDelta/9, collisionHandler, map);
    }

    CameraEntity.prototype.moveAxis = function(axis, distance, collisionHandler, map) {
        var isXaxis = axis === "x";
        var currentTiles = collisionHandler.collidingTiles(map, this.rect);
        // Move forward the right position area, then look at the tiles the rect is on
        // and see if there are any new tile effects to be applied
        if (isXaxis) { 
            this.rect.position.x = goody.cap(this.rect.position.x + distance, 0, map.pixelWidth - this.rect.width - 1); 
        } 
        else { 
            this.rect.position.y = goody.cap(this.rect.position.y + distance, 0, map.pixelHeight - this.rect.height - 1); 
        }
        var newTiles = collisionHandler.collidingTiles(map, this.rect);
        // See if you're on any new tiles
        for (var i = 0; i < newTiles.length; i++) {
            // If the one of the new tiles was just stepped onto
            if (map.collisionMap[newTiles[i]] !== 0) {
                this.moveBack(isXaxis, distance, newTiles[i], map);
                i = newTiles.length;
            }
            else if (!goody.inArray(currentTiles, newTiles[i])) { 
                var newTile = newTiles[i];
            }
        }
    }

    CameraEntity.prototype.moveBack = function(isXaxis, distance, newTile, map){
    }
    
    return {
        CameraEntity: CameraEntity
    };
});