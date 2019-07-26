/*
Base class for all entities
*/
define(["lib/goody", "assets/vars"],
function(goody, vars)
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
say flo annoyed:What? Thirty eyes ruined, thirty eyes given. That sounds like a fair payment, doesn't it?
say flo annoyed:Hmph.
`
}
	json.script = json.script.split("\n");
	this.json = json;
	this.index = 0;
	this.state = []
	this.nextLine();
    }

    Script.prototype.update = function(delta) {
    }
    
    Script.prototype.nextLine = function() {
        this.index += 1;
        var line = this.json.script[this.index].split(":");
        this.instruction = line[0].split(" ");
        this.line = line[1];
    }

    Script.prototype.click = function(mousePosition) {
        if (this.instruction[0] === "say") {
            this.nextLine();
        }
    }

    
    return {
        Script:Script
    };
});