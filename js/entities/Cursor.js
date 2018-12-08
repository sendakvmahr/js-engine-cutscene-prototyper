define(["display/Animation", "physics/Vector", "lib/goody"],
function(Animation, Vector, goody)
{    
    function Cursor(element) {
        this.position = new Vector.Vector(0,0); 
        // !!! Hardcoded, should be more flexible
        this.sprite = new Animation.Animation(images.dragonfly, 2, 19, 18);
        this.offset = new Vector.Vector(5 * element, 0);
    };

    Cursor.prototype.display = function(ctx) {
        this.sprite.display(ctx, this.position);
    }

    Cursor.prototype.update = function(input) {
        this.move(input);
        this.sprite.update();
    }
    
    Cursor.prototype.move = function(input) {
        var x = input.mousePosition.x;
        var y = input.mousePosition.y;
        var angle = new Vector.Vector(this.position.x - x, this.position.y - y);
        // Update the sprite... when you decide the sprite... 
        this.position.x = x;
        this.position.y = y;
    };
                
    return {
        Cursor:Cursor
    }    
});