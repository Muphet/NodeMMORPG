define(['underscore', 'backbone', 'lib/Shared/Logger', 'lib/Server/Clients'], function(_, Backbone, Logger, Clients){
	/**
	* An entity collector.
	* @module lib
	* @submodule lib_Server
	* @class lib_Server_Factory
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
		
		this.listenTo(Clients, 'clients:join', this.clients_join);
		this.listenTo(Clients, 'clients:leave', this.clients_leave);
	};
	
	/**
	* Generates a new uuid
	* @method uuid
	**/
	p.uuid = function(){
		this._uuid++;
		return 'e'+this._uuid;
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
		this.listenTo(entity, 'self:despawn', this.despawn);
		
		// Inform clients of spawned entity
		Clients.messageToChannels(entity.channels, 'factory:spawn', entity.syncVars());
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
		this.stopListening(entity);
		
		// Inform clients of despawned entity
		Clients.messageToChannels(entity.channels, 'factory:despawn', {uuid: entity.uuid});
	};
	
	/**
	* Triggered once an entity changes a property, all subscribed clients should be informed!
	* @method update
	* @param entity
	* @param key
	* @param old_value
	**/
	p.update = function(entity, key, old_value){
		Clients.messageToChannels(entity.channels, 'factory:update', {"uuid": entity.uuid, "key": key, "value": entity[key], "old_value": old_value});
	};
	
	/**
	* Informs any clients I just joined.
	* @method join
	* @param channel {String} Just joined channel.
	**/
	p.join = function(entity, channel){
		Clients.messageToChannel(channel, 'factory:spawn', entity.syncVars());
	};
	
	/**
	* Informs any clients I just joined.
	* @method join
	* @param channel {String} Just joined channel.
	**/
	p.leave = function(entity, channel){
		Clients.messageToChannel(channel, 'factory:despawn', {uuid: entity.uuid});
	};
	
	/**
	* Trigger for client joined a channel
	* @method clients_join
	* @param client
	* @param channel
	**/
	/**
	* Trigger for client leaved a channel
	* @method clients_leave
	* @param client
	* @param channel
	**/
	p.clients_join = p.clients_leave = function(client, channel){
		this.sync(client);
	};
	
	/**
	* Resync clients entities.
	* @method sync
	* @param socket {Socket} A Joinable object wich contains any socket.
	**/
	p.sync = function(client){
		Logger.getLogger("Factory").debug("Sending resync for client #"+client.uuid);
		data = _.filter(this.entities, function(e){
			return e.inAny(client.channels);
		});
		data = _.map(data, function(e){
			return e.syncVars(); // Returns empty function if e.syncVars does not exists.
		});
		client.socket.emit('factory:sync', data);
	};
	
	// TODO: on connect, call sync.
	return new Factory();
});