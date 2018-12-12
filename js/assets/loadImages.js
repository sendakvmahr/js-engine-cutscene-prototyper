// images are fetched from root/images
var imageNames = [
	"dragonfly",
	"MC",
    "BaseTiles" ,
	"Tileset" ,
    "startButton",
    "titleScreen", 
    "MCshadow", 
    "intro_P0",
    "intro_P1",
    "intro_P2",
    "demo"
]

var images = {};

$(function() {  
    // loads listed images and stores them in the images using their provided name
    var loaded = 0;
    var numImages = imageNames.length;
    if (imageNames.length == 0) {
        start();
    }
    else {
        for (var i = 0; i < numImages; i++) {
            var index = imageNames[i];
            images[index] = new Image();
            images[index].src = "images/" + index + ".png";
            images[index].onload = function(){ 
                loaded++;
                if (loaded === numImages) {
                    start();
                } 
            }
        }
    }
});
