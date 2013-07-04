define(['underscore', 'backbone', 'Shared/Logger','Client/EntityDictionary'], function(_, Backbone, Logger, EntityDictionary){
	/**
	* Factory on client side, it is basically a replicator.
	* @constructor
	* @class Factory
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
	* Binds Factory methods on a socket.
	* @method listen
	**/
	p.listen = function(socket){
		var that = this;
		socket.on('factory:subscribed', this.reset);
		socket.on('factory:unscribed', this.reset);
		socket.on('disconnect', this.reset);
		socket.on('factory:spawn', function(data){
			var entityType = data._entityType || 'Entity';
			var entity = new EntityDictionary[entityType](data);
			that.spawn(entity);
		});
		socket.on('factory:despawn', function(data){
			that.despawn(that.get(data.uuid || null));
		});
	};
	
	/**
	* Reset current factory.
	* @method reset
	**/
	p.reset = function(){
		_.each(this.entities, function(e){
			if(typeof(e['despawn']) == "function"){
				e.despawn();
			}
		});
		this.entities = [];
	};
	
	/**
	* Spawns an entity from given data.
	* @method spawn
	**/
	p.spawn = function(entity){
		if(entity !== null){
			Logger.getLogger('Factory').debug('Spawning an entity.');		
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
			Logger.getLogger('Factory').debug('Despawning an entity.');
			if(typeof(entity['despawn']) === "function"){
				entity.despawn();
			}
			this.trigger('despawn', entity);
			this.entities = _.without(this.entities, entity);
		}
	};
	
	return new Factory();
});