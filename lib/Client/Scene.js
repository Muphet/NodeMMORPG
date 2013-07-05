define(function(){
	/**
	* A basic scene used by scene manager.
	* @module lib
	* @submodule lib_Client
	* @class lib_Client_Scene
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