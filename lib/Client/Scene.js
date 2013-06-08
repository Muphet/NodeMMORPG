define(function(){
	/**
	* A basic scene used by scene manager.
	* @class Scene
	* @constructor
	**/
	function Scene(){
		this.uuid = Math.random();
	}
	
	var p = Scene.prototype;
	
	p.create = function(){};
	p.open = function(){};
	p.close = function(){};
	p.destroy = function(){};
	p.toString = function(){ return this.uuid; }
	return Scene;
});