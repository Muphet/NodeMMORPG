define(function(){
	/**
	* Logger utilities, only interface to console methods.
	* @class Logger
	* @constructor
	**/
	function Logger(){
		this.initialize();
	}
	var p = Logger.prototype;
	
	/**
	* All instances of active loggers.
	* @property loggers
	**/
	p.loggers = {};
	
	/**
	* @method initialize
	**/
	p.initialize = function(){
	};
	
	p.log = function(name, arguments){
		var txt = '';
		for(var i = 0; i < arguments.length; i++){
			txt += arguments[i];
		}
		console.log(name+' - '+txt);
	}
	
	/**
	* Get requested logger, or create instance if not exists.
	* @method getLogger
	* @param name
	**/
	p.getLogger = function(name){
		var that = this;
		if(typeof(this.loggers[name]) === "undefined"){
			this.loggers[name] = {
				info: function(){
					if(typeof(console.info) === "function"){
						console.info(name, arguments);
					}else{
						that.log(name, arguments);
					}
				},
				warn: function(){
					if(typeof(console.warn) === "function"){
						console.warn(name, arguments);
					}else{
						that.log(name, arguments);
					}
				},
				debug: function(){
					if(typeof(console.debug) === "function"){
						console.debug(name, arguments);
					}else{
						that.log(name, arguments);
					}
				}
			};
		}
		return this.loggers[name];
	};
	return new Logger();
});