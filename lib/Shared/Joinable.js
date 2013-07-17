define(['underscore', 'backbone'], function(_, Backbone){
	/**
	* Manage channels joining.
	* @class Joinable
	* @constructor
	**/
	function Joinable(){
		this.initialize();
	}
	
	var p = Joinable.prototype;
	
	// Append Backbone.Events on this!
	_.extend(p, Backbone.Events);
	
	/**
	* Channels joined by current replicator.
	* @property channels
	* @default []
	**/
	p.channels = [];
	
	/**
	* Initialize method
	* @method initialize
	**/
	p.initialize = function(){
		this.channels = [];
	};
	
	/**
	* Returns boolean based on if user joined a channel.
	* @method in
	* @param channel {String} Channel to check if joined.
	**/
	p.in = function(channel){
		if(_.indexOf(this.channels, channel) > -1){
			return true;
		}else{
			return false;
		}
	};
	
	/**
	* Returns boolean based on if user joined any of supplied channels.
	* @method inAny
	* @param channels {Array} Channels to check for.
	**/
	p.inAny = function(channels){
		var passed = false;
		for(var i = 0; i < channels.length; i++){
			if(this.in(channels[i])){
				passed = true;
			}
		}
		return passed;
	};
	
	/**
	* Joins replicator to a channel... if not joined already.
	* @method join
	* @param channel {String} Channel to join.
	**/
	p.join = function(channel){
		if(!this.in(channel)){
			this.channels.push(channel);
			this.trigger('join', this, channel);
		}
	};
	
	/**
	* Leave a channel, if I was joined.
	* @method leave
	* @param channel {String} Channel to leave.
	**/
	p.leave = function(channel){
		if(this.in(channel)){
			this.trigger('leave', this, channel);
			this.channels = _.without(this.channels, channel);
		}
	};
	
	return Joinable;
});