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
"joking": ["flo pose neutral.png", "flo mouth happy.png", "flo eyes side.png"],
"annoyed": ["flo pose neutral.png", "flo mouth happy.png", "flo eyes neutral.png"]
}
},
"script": 
`
say flo annoyed:What? Thirty eyes ruined, thirty eyes given. That sounds like a fair payment, doesn't it?
say flo joking:Hmph.
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
    
    Script.prototype.getPortrait = function() {
        if (this.instruction !== "") {
        var chr = this.instruction[1];
        var mood = this.instruction[2];
        var prefix = "./images/portrait_composites/" + chr + "/";
        var files = this.json["characters"][chr][mood];
        var result = [];
        for (var i=0; i<files.length; i++) {
            result.push(prefix + files[i])
        }
        return result;
        }
        return ["", "", ""];    

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