define([],
function()
{
tiles = 
{
	"tiles": [{
		"name": "BaseTiles",
		"image": "BaseTiles.png",
		"width": "192",
		"height": "192",
		"tilecount": "1536",
		"properties": [
			{
				"id": 1,
				"spawn": "testEntity2",
			},
			{
				"id": 8,
				"camera": "true",
				"spawn": "testEntity",
			},
		]
	}
]}
return tiles;
});