define(['lib/Shared/Logger','underscore','backbone'], function(Logger, _, Backbone){
	/**
	* Manage connected clients.
	* @module lib
	* @submodule lib_Server
	* @class lib_Server_Clients
	* @constructor
	**/
	function Clients(){
		
	}	
	var p = Clients.prototype;
	_.extend(p, Backbone.Events);
	
	/**
	* Store all clients.
	* @property clients
	* @default []
	**/
	p.clients = [];
	
	/**
	* Last used uuid, like a AutoIncrement generator.
	* @property _uuid
	* @default 0
	**/
	p._uuid = 0;
	
	/**
	* Generates a new uuid
	* @method uuid
	**/
	p.uuid = function(){
		this._uuid++;
		return 'c'+this._uuid;
	};
	
	/**
	* Subscribe a client to the Clients.
	* @method subscribe
	* @param socket {Socket} A Joinable object wich contains any socket.
	**/
	p.subscribe = function(client){
		if(typeof(client.uuid) === "undefined" || client.uuid == null){
			client.uuid = this.uuid();
		}
		Logger.getLogger('Clients').debug('#'+client.uuid+' Client subscribed.');
		client.trigger('subscribe');
		this.clients.push(client);
		this.trigger('subscribe', client);
		this.listenTo(client, 'join', this.join);
		this.listenTo(client, 'leave', this.leave);
		if(typeof(client.socket) != "undefined"){
			client.socket.emit('clients:subscribed');
		}
	};
	
	/**
	* Unscribe a client from the Clients.
	* @method unscribe
	* @param socket {Socket} A Joinable object wich contains any socket.
	**/
	p.unscribe = function(client){
		Logger.getLogger('Clients').debug('#'+client.uuid+' Client unscribed.');
		this.clients = _.without(this.clients, client);
		client.trigger('unscribe');
		this.trigger('unscribe', client);
		this.stopListening(client);
		if(typeof(client.socket) != "undefined"){
			client.socket.emit('clients:unscribed');
		}
	}
	
	/**
	* Sends a message to clients filtering on the fn.
	* @method message
	* @param fn {Function} A filtering function that returns true if element is correct.
	* @param event {String} Event to call.
	* @param params {Object} An object to be emitted with the event.
	**/
	p.message = function(fn, event, params){
		_.each(_.filter(this.clients, fn), function(e){
			if(typeof(e.socket) != "undefined"){
				e.socket.emit(event, params);
			}
		});
	};
	
	/**
	* Sends a message to clients connected on a channel.
	* @method messageToChannel
	* @param channel {String} Channel to send message over.
	* @param event {String} Event to call.
	* @param params {Object} An object to be emitted with the event.
	**/
	p.messageToChannel = function(channel, event, params){
		return this.message(function(e){
			return e.in(channel);
		}, event, params);
	};
	
	/**
	* Sends a message to clients connected at least on one of specified channels.
	* @method messageToChannels
	* @param channels {String} Channels to send message over.
	* @param event {String} Event to call.
	* @param params {Object} An object to be emitted with the event.
	**/
	p.messageToChannels = function(channels, event, params){
		return this.message(function(e){
			return e.inAny(channels);
		}, event, params);
	};
	
	p.join = function(client, channel){
		Logger.getLogger('Clients').debug('#'+client.uuid+' Client joined '+channel);
		this.trigger('clients:join', client, channel);
	};
	p.leave = function(client, channel){
		Logger.getLogger('Clients').debug('#'+client.uuid+' Client leave '+channel);
		this.trigger('clients:leave', client, channel);
	};
	
	return new Clients();
});