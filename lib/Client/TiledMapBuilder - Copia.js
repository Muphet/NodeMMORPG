define(['createjs'], function(createjs){
	/**
	* From an exported tiled json builds a set of cached containers.
	* @class TiledMapBuilder
	* @constructor
	**/
	function TiledMapBuilder(data){
		this.initialize(data);
	}
	var p = TiledMapBuilder.prototype;
	
	p.json = {};
	
	p.initialize = function(data){
		this.json = data;
		this.build();
	};
	/**
	* Returns tile image e rects for given gid.
	* @method getTile
	* @param gid Tile id.
	**/
	p.getTile = function(gid){
		var r = this.tileset.getFrame(gid-1);
		var a = new createjs.Bitmap(r.image);
		a.sourceRect = r.rect;
		return a;
	};
	
	p.cache = function(){
		console.log(this);
		this.sprite.cache();
		for(var k in this.layers){
			//console.log("Caching with "+that.sprite.children[j].children.length+" entities");
			(function(sprite){ sprite.cache(); })(this.layers[k]);
		}
	};
	
	/**
	* Builds sprite sheet and calls a callback once built.
	* @param data Tiled JSON.
	**/
	p.build = function(){
		var that = this;
		this.layers = {};
		this.tileset = false;
		this.images = [];
		this.loaded = 0;
		this.sprite = new createjs.Container();
		var frames = [];
		for(var i = 0; i < this.json.tilesets.length; i++){
			var a = new Image();
			a.src = this.json.tilesets[i].image;
			a.onload = function(){
				that.loaded++;
				console.log(that.loaded);
				if(that.loaded >= that.images.length){
					//setTimeout(that.cache, 100);
					console.log(that.sprite);
					that.sprite.cache();
				}
			};
			this.images.push(a);
						
			for(var y = 0; y < Math.floor(this.json.tilesets[i].imageheight/this.json.tileheight); y++){
				for(var x = 0; x < Math.floor(this.json.tilesets[i].imagewidth/this.json.tilewidth); x++){
					frames.push([i,x*this.json.tilewidth,y*this.json.tileheight]);
				}
			}
		}
		
		for(var i = 0; i < this.json.layers.length; i++){
			this.layers[this.json.layers[i].name] = new createjs.Container();
			this.sprite.addChild(this.layers[this.json.layers[i].name]);
			for(var y = 0; y < this.json.layers[i].height; y++){
				for(var x = 0; x < this.json.layers[i].width; x++){
					var idx = (y * this.json.layers[i].width) + x;
					if(this.json.layers[i].type == "tilelayer"){
						if(typeof(this.json.layers[i].data[idx]) !== "undefined"){
							if(this.json.layers[i].data[idx] > 0){
								var gid = this.json.layers[i].data[idx]-1;
								var tile = new createjs.Bitmap(this.images[frames[gid][0]]);
								tile.sourceRect = new createjs.Rectangle(frames[gid][1],frames[gid][2],this.json.tilewidth, this.json.tileheight);
								tile.x = this.json.tilewidth * x;
								tile.y = this.json.tileheight * y;
								this.layers[this.json.layers[i].name].addChild(tile);
							}
						}
					}
				}
			}
		}
		return this.sprite;
	};
	
	return TiledMapBuilder;
});