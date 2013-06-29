define(['underscore', 'backbone', 'Shared/Logger'], function(_, Backbone, Logger){
	/**
	* An entity collector.
	* @class Factory
	* @constructor
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
	* Last used uuid, like a AutoIncrement generator.
	* @property _uuid
	* @default 0
	**/
	p._uuid = 0;
	
	/**
	* Initializing
	* @method initialize
	**/
	p.initialize = function(){
		this.entities = [];
		this._uuid = 0;
	};
	
	/**
	* Generates a new uuid
	* @method uuid
	**/
	p.uuid = function(){
		this._uuid++;
		return this._uuid;
	};
	
	/**
	* Returns an entity by its uuid.
	* @param uuid UUID
	**/
	p.get = function(uuid){
		return _.findWhere(this.entities, {uuid: uuid || false}) || null;
	};
	
	/**
	* Spawn an entitiy into the world, also auto trigger entity method.
	* @method spawn
	* @param entity {Entity} An Entity.
	**/
	p.spawn = function(entity){
		Logger.getLogger('Factory').debug('Spawning an entity.');
		// If entity uuid is null, assing it automatically.
		if(entity.uuid == null){
			entity.uuid = this.uuid(); // We don't use set to escape from triggers.
		}
		
		this.entities.push(entity);
		
		if(typeof(entity['spawn']) === "function"){
			entity.spawn();
		}
		this.trigger('spawn', entity);	
		// Listen the entity and auto trigger on changes.
		this.listenTo(entity, 'update', this.update);
		this.listenTo(entity, 'join', this.join);
		this.listenTo(entity, 'leave', this.leave);
		
		// Inform clients of spawned entity
		_.each(_.filter(this.replicators, function(e){
			return e.inAny(entity.channels);
		}), function(e){
			if(typeof(e.socket) != "undefined"){
				e.socket.emit('factory:spawn', entity.syncVars());
			}
		});
	};
	
	/**
	* Despawn an entitiy from the world, also auto trigger entity method.
	* @method despawn
	* @param entity {Entity} An Entity.
	**/
	p.despawn = function(entity){
		Logger.getLogger('Factory').debug('Despawning an entity.');
		if(typeof(entity['despawn']) === "function"){
			entity.despawn();
		}
		this.trigger('despawn', entity);
		this.entities = _.without(this.entities, entity);
		
		// Inform clients of despawned entity
		_.each(_.filter(this.replicators, function(e){
			return e.inAny(entity.channels);
		}), function(e){
			if(typeof(e.socket) != "undefined"){
				e.socket.emit('factory:despawn', {uuid: entity.uuid});
			}
		});
	};
	
	/**
	* Triggered once an entity changes a property, all subscribed clients should be informed!
	* @method update
	* @param entity
	* @param key
	* @param old_value
	**/
	p.update = function(entity, key, old_value){
		_.each(_.filter(this.replicators, function(e){
			return e.inAny(entity.channels);
		}), function(e){
			if(typeof(e.socket) != "undefined"){
				e.socket.emit('factory:update', {"uuid": entity.uuid, "key": key, "value": entity[key], "old_value": old_value});
			}
		});
	};
	
	/**
	* Informs any clients I just joined.
	* @method join
	* @param channel {String} Just joined channel.
	**/
	p.join = function(channel){
		_.each(_.filter(this.replicators, function(e){
			return e.in(channel);
		}), function(e){
			if(typeof(e.socket) != "undefined"){
				e.socket.emit('factory:spawn', (entity.syncVars || function(){ return {}; })());
			}
		});
	};
	
	/**
	* Informs any clients I just joined.
	* @method join
	* @param channel {String} Just joined channel.
	**/
	p.leave = function(channel){
		_.each(_.filter(this.replicators, function(e){
			return e.in(channel);
		}), function(e){
			if(typeof(e.socket) != "undefined"){
				e.socket.emit('factory:despawn', {uuid: entity.uuid});
			}
		});
	};
	
	/**
	* Store all replicators.
	* @property replicators
	* @default []
	**/
	p.replicators = [];
	
	/**
	* Subscribe a replicator to the factory.
	* @method subscribe
	* @param socket {Socket} A Joinable object wich contains any socket.
	**/
	p.subscribe = function(entity){
		Logger.getLogger('Factory').debug('Subscribed a replicator.');
		entity.trigger('subscribe');
		this.replicators.push(entity);
		this.trigger('subscribe', entity);
		if(typeof(entity.socket) != "undefined"){
			entity.socket.emit('factory:subscribed');
			this.sync(entity);
		}
	};
	
	/**
	* Describe a replicator from the factory.
	* @method unscribe
	* @param socket {Socket} A Joinable object wich contains any socket.
	**/
	p.unscribe = function(entity){
		Logger.getLogger('Factory').debug('Unscribed a replicator.');
		this.replicators = _.without(this.replicators, entity);
		entity.trigger('unscribe');
		this.trigger('unscribe', entity);
		if(typeof(entity.socket) != "undefined"){
			entity.socket.emit('factory:unscribed');
		}
	}
	
	/**
	* Resync clients entities.
	* @method sync
	* @param socket {Socket} A Joinable object wich contains any socket.
	**/
	p.sync = function(entity){
		data = _.filter(this.entities, function(e){
			return e.inAny(entity.channels);
		});
		data = _.map(data, function(e){
			return (e.syncVars || function(){ return {}; })(); // Returns empty function if e.syncVars does not exists.
		});
		entity.socket.emit('factory:sync', data);
	};

	return new Factory();
});