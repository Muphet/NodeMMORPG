define(['underscore', 'backbone'], function(_, Backbone){
	/**
	* A client-side entity.
	* @module lib
	* @submodule lib_Client
	* @class lib_Client_Entity
	* @constructor
	**/
	function Entity(data){
		this.initialize(data);
	}
	
	var p = Entity.prototype;
	_.extend(p, Backbone.Events);
	
	p.initialize = function(data){
		_.extend(this, data);
	};
	
	p.spawn = function(){console.log('spawn');}; // Called on spawn.
	p.despawn = function(){}; // Called on despawn.
	
	return Entity;
});