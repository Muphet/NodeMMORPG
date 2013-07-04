define(['createjs'], function(createjs){
	/**
	* From an exported tiled json builds a set of cached containers.
	* @class TiledMapBuilder
	* @constructor
	**/
	function TiledMapBuilder(data){
		this.initialize(data);
	}
	var p = TiledMapBuilder.prototype = new createjs.Container();
	
	p.json = {};
	
	p.Container_initialize = p.initialize;
	p.initialize = function(data){
		this.Container_initialize();
		this.json = data;
		this.build();
	};
	
	p.build = function(){
		this.images = [];
		this.layers = {};
		for(var i = 0; i < this.json.tilesets.length; i++){
			this.images.push(this.json.tilesets[i].image);
		}
		var params = {
			images: this.images,
			frames: {
				width: this.json.tilewidth,
				height: this.json.tileheight
			}
		};
		this.tileset = new createjs.SpriteSheet(params);
		this.sprite = new createjs.Container();
		for(var i = 0; i < this.json.layers.length; i++){
			this.layers[this.json.layers[i].name] = new createjs.Container();
			this.addChild(this.layers[this.json.layers[i].name]);
			for(var y = 0; y < this.json.height; y++){
				for(var x = 0; x < this.json.width; x++){
					var idx = (y * this.json.layers[i].width) + x;
					var gid = this.json.layers[i].data[idx];
					if(gid > 0){
						var tile = new createjs.BitmapAnimation(this.tileset);
						tile.gotoAndStop(gid-1);
						tile.x = this.json.tilewidth * x;
						tile.y = this.json.tileheight * y;
						this.layers[this.json.layers[i].name].addChild(tile);
					}
				}
			}
		}
		var that = this;
		var cache = function(){
			for(var i = 0; i < that.json.layers.length; i++){
				that.layers[that.json.layers[i].name].cache(0,0,that.json.width*that.json.tilewidth, that.json.height*that.json.tileheight);
			}
		};
		this.tileset.addEventListener("complete", cache);
		setTimeout(cache,10000);
	};
	
	return TiledMapBuilder;
});