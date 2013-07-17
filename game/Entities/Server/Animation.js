define(['lib/Server/Entity'], function(Entity){
	function EntityAnimation(){
		this.initialize();
	}
	
	var p = EntityAnimation.prototype = new Entity();
	
	p._entityType = 'Animation';
	p.animation = "main";
	p.x = 100;
	p.y = 100;
	p.spritesheet = {
			images: ["game/Graphics/Animations/Fire.png"],
			frames: {width: 50, height:50, regX: 25, regY: 25},
			animations: {
				main: {
					frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],
					frequency: 2
				}
			}
		};
	
	p.Entity_syncVars = p.syncVars;
	p.syncVars = function(obj){
		var obj = obj || {};
		obj.x = this.x;
		obj.y = this.y;
		obj.spritesheet = this.spritesheet;
		obj.animation = this.animation;
		return this.Entity_syncVars(obj);
	}

	return EntityAnimation;
});