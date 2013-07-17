define(['lib/Client/GameCanvas','lib/Client/Entity', 'createjs','underscore'], function(GameCanvas, Entity, createjs,_){
	function EntityAnimation(data){
		this.initialize(data);
	}
	
	var p = EntityAnimation.prototype = new Entity();
	
	p.Entity_initialize = p.initialize;
	p.initialize = function(data){
		_.extend(this, data);
		console.log(this.spritesheet);
		this.sprite = new createjs.BitmapAnimation(new createjs.SpriteSheet(this.spritesheet));
		this.Entity_initialize(data);
	};
	
	p.spawn = function(){
		GameCanvas.addChild(this.sprite);
		this.sprite.gotoAndPlay(this.animation);
		this.sprite.x = this.x;
		this.sprite.y = this.y;
	}
	
	p.despawn = function(){
		GameCanvas.removeChild(this.sprite);
	};
	
	return EntityAnimation;
});