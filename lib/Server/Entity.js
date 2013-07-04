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
	
	/**
	* Get vars to send over socket to construct Entity on client side.
	* @method syncVars
	* @param obj {Object} 
	**/	
	p.syncVars = function(obj){
		var obj = obj || {};
		obj.uuid = this.uuid;
		obj._entityType = this._entityType;
		return obj;
	}
	
	/**
	* Updates current Entity property and trigger update event.
	* @method set
	* @param key {String} Key to update
	* @param value Value to update.
	**/
	p.set = function(key, value){
		var old_value = this[key];
		this[key] = value;
		this.trigger('update', this, key, old_value);
	};
	
	/*
	* Called on spawn, needs to be overwritten.
	* @method spawn
	**/
	p.spawn = function(){}; // Called on spawn.
	/*
	* Called on despawn, needs to be overwritten.
	* @method despawn
	**/
	p.despawn = function(){}; // Called on despawn.
	
	return Entity;
});