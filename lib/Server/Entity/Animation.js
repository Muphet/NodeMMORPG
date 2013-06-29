define(['Server/Entity'], function(Entity){
	function EntityAnimation(){
		this.initialize();
	}
	
	var p = EntityAnimation.prototype = new Entity();
	
	p._entityType = 'EntityAnimation';

	return EntityAnimation;
});