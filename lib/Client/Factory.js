define(['underscore', 'backbone', 'lib/Shared/Logger','lib/Client/Package'], function(_, Backbone, Logger, Package){
	/**
	* Factory on client side, it is basically a replicator.
	* @constructor
	* @module lib
	* @submodule lib_Client
	* @class lib_Client_Factory
	**/
	function Factory(){
		this.initialize();
	}
	var p = Factory.prototype;
	_.extend(p, Backbone.Events);
	
	/**
	* Store all entities.
	* @property entities
	* @default []
	**/
	p.entities = [];

	/**
	* Initializing
	* @method initialize
	**/
	p.initialize = function(){
		this.entities = [];
	};
		
	/**
	* Returns an entity by its uuid.
	* @param uuid UUID
	**/
	p.get = function(uuid){
		return _.findWhere(this.entities, {uuid: uuid || false}) || null;
	};
	
	/**
	* Syncs from data
	* @method syncFromData
	* @param data {Array} Received data.
	**/
	p.syncFromData = function(data){
		Logger.getLogger("Factory").debug('Syncing....');
		console.log(data);
		var that = this;
		var tmp = this.entities.splice();
		_.each(this.entities, function(e){
			if(_.findWhere(data, {uuid: e.uuid}) == null){ // Entity not found in data
				that.despawn(e);
			}
		});
		_.each(data, function(d){
			var e = that.get(d.uuid);
			if(e == null){ // Entity not found in this.entities
				var entityType = d._entityType || 'Entity';
				var entity = new (Package.entities(entityType))(d);
				that.spawn(entity);
			}else{
				// Found, check values.
				for(var i in d){
					if(d.hasOwnProperty(i)){
						if(e[i] !== d[i]){
							this.get(d.uuid).set(i, d[i]); // Send update!
						}
					}
				}
			}
		});
	};

	
	/**
	* Reset current factory.
	* @method reset
	**/
	p.reset = function(){
		var that = this;
		Logger.getLogger("Factory").debug('Resetting...');
		_.each(this.entities, function(e){
			if(typeof(e['despawn']) == "function"){
				e.despawn();
			}
			that.entities = _.without(that.entities, e);
		});
		this.entities = [];
	};
	
	/**
	* Spawns an entity from given data.
	* @method spawn
	**/
	p.spawn = function(entity){
		if(entity !== null){
			Logger.getLogger('Factory').debug('Spawning an entity #'+entity.uuid+'.');		
			this.entities.push(entity);
			
			if(typeof(entity['spawn']) === "function"){
				entity.spawn();
			}
			this.trigger('spawn', entity);
		}
	};
	
	/**
	* Despawns an entity.
	* @method despawn
	**/
	p.despawn = function(entity){
		if(entity !== null){
			Logger.getLogger('Factory').debug('Despawning an entity #'+entity.uuid+'.');
			if(typeof(entity['despawn']) === "function"){
				entity.despawn();
			}
			this.trigger('despawn', entity);
			this.entities = _.without(this.entities, entity);
		}
	};
	
	
	/**
	* Binds Factory methods on a socket.
	* @method listen
	**/
	p.listen = function(socket){
		var that = this;
		socket.on('clients:subscribed', this.reset);
		socket.on('clients:unscribed', this.reset);
		socket.on('connect', this.reset);
		socket.on('factory:spawn', function(data){
			var entityType = data._entityType || 'Entity';
			var entity = new (Package.entities(entityType))(data);
			that.spawn(entity);
		});
		socket.on('factory:despawn', function(data){
			that.despawn(that.get(data.uuid || null));
		});
		socket.on('factory:sync', function(data){
			that.syncFromData(data);
		});
	};
	
	return new Factory();
});