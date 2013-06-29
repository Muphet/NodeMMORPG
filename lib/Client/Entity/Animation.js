define(['Client/GameCanvas','Client/Entity', 'createjs'], function(GameCanvas, Entity, createjs){
	function EntityAnimation(data){
		this.initialize(data);
	}
	
	var p = EntityAnimation.prototype = new Entity();
	
	p.Entity_initialize = p.initialize;
	p.initialize = function(data){
		this.spritesheet = new createjs.SpriteSheet({
			images: ["static/images/animations/Fire.png"],
			frames: {width: 50, height:50, regX: 25, regY: 25},
			animations: {
				explosion: {
					frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],
					frequency: 2,
					next: false,
				}
			}
		});
		this.sprite = new createjs.BitmapAnimation(this.spritesheet);
		this.Entity_initialize(data);
	};
	
	p.spawn = function(){
		GameCanvas.addChild(this.sprite);
		this.sprite.gotoAndPlay("explosion");
		this.sprite.x = 100;
		this.sprite.y = 100;
	}
	
	p.despawn = function(){
		GameCanvas.removeChild(this.sprite);
	};
	
	return EntityAnimation;
});