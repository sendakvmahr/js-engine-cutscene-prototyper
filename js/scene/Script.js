/*
Base class for all entities
*/
define(["lib/goody"],
function(goody)
{    
    function Script(json) {   
// testing locally and chrome is annoying with files when that happens
json = {
	"map": "map",
	"characters": {
		"flo" : {
			"annoyed": ["flo pose neutral.png", "flo mouth angry.png", "flo eyes side.png"]
		}
	},
"script": 
`
say flo annoyed:"What?"
`
}
	json.script = json.script.split("\n");
	this.json = json;
	this.index = 1;
	this.state = []
	this.update(0);
    }

    Script.prototype.update = function(delta) {
    	var line = this.json.script[this.index].split(":");
    	var instructions = line[0].split(" ");
    	line = line[1];
    	this.state = [instructions, line];
    }

    Script.prototype.display = function(ctx) {
    	switch(this.state[0][0]) {
    		case "say": 
    			this.renderText(ctx);
    	}

    }

    Script.prototype.renderText = function(ctx) {
    	ctx.font = "30px Arial";
    	ctx.fillStyle = "white";
		ctx.fillText(this.state[1], 300, 300);

    }
    
    return {
        Script:Script
    };
});