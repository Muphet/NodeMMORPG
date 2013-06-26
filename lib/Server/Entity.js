define(['underscore', 'backbone', 'Shared/Joinable'], function(_, Backbone, Joinable){
	/**
	* A server-side entity.
	* @class Entity
	* @extends Joinable
	* @constructor
	**/
	function Entity(){
		this.initialize();
	}
	
	var p = Entity.prototype = new Joinable();
	_.extend(p, Backbone.Events);
	
	p.syncVars = function(obj){
		var obj = obj || {};
		obj.uuid = this.uuid;
		obj._entityType = 'Entity';
		return obj;
	}
	
	p.set = function(key, value){
		var old_value = this[key];
		this[key] = value;
		this.trigger('update', this, key, old_value);
	};
	
	p.spawn = function(){}; // Called on spawn.
	p.despawn = function(){}; // Called on despawn.
	
	return Entity;
});