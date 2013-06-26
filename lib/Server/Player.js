define(['underscore', 'Shared/Joinable'], function(_, Joinable){
	/**
	* Collects multiple Replicators. Each replicator can join on multiple channels
	* @class Player
	* @constructor
	**/
	function Player(socket){
		this.initialize(socket);
	}
	
	var p = Player.prototype = new Joinable();
	
	/**
	* @method initialize
	**/
	p.initialize = function(socket){
		this.socket = socket;
	};
	
	return Player;
});