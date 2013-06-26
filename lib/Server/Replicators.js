define(['underscore', 'backbone'], function(_, Backbone){
	/**
	* Collects multiple Replicators. Each replicator can join on multiple channels
	* @class Replicators
	* @constructor
	**/
	function Replicators(){
		this.initialize();
	}
	
	var p = Replicators.prototype;
	
	/**
	* @method initialize
	**/
	p.initialize = function(){
		this.replicators = [];
	};
});