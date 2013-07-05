define(["lib/Shared/Logger"], function(Logger){
	/**
	* Preloads any image.
	* @module lib
	* @submodule lib_Client
	* @class lib_Client_Preloader
	* @constructor
	**/
	function Preloader(){
		this.initialize();
	}
	
	var p = Preloader.prototype;
	
	/**
	* @property entries
	**/
	p.entries = {};
	
	/**
	* Loaded entries count.
	* @property loaded
	**/
	p._loaded = 0;
	
	/**
	* @method initialize
	* @protected
	**/
	p.initialize = function(){
		this.entries = {};
	};
	
	/**
	* Returns an Image object of preloaded image.
	* @method get
	* @param namespace {String} Preloaded image namespace to get
	**/
	p.get = function(namespace){
		return this.entries[namespace] || null;
	};
	
	/**
	* Add new Image entries to load.
	* @method append
	* @param namespace {String} Namespace for image.
	* @param src {String} URL of image to preload.
	**/
	p.append = function(namespace, src){
		Logger.getLogger("Preloader").debug("New ["+namespace+"] resource using "+src);
		var i = new Image();
		i.src = src;
		this.entries[namespace] = i;
		var that = this;
		i.onLoad = function(){
			that._loaded++;
		};
	};
	
	/**
	* Preloads a lot of resources.
	* @method appendManifest
	* @param manifest {Object} A dictionary of namespaces and src.
	**/
	p.appendManifest = function(manifest){
		for(var namespace in manifest){
			this.append(namespace, manifest[namespace]);
		}
	};
	
	/**
	* Get current loading percentage, or false on fully loaded.
	* @method getPercentage
	**/
	p.getPercentage = function(){
		if(this._loaded == this.entries.length){
			return false;
		}
		if(this._loaded == 0){
			return 0;
		}
		return Math.floor(this._loaded/this.entries.length);
	};
	
	/**
	* Calls a function when all is preloaded.
	* @method loaded
	* @param fn {Function} Function to be called after loading succeded.
	**/
	p.loaded = function(fn){
		var that = this;
		if(this.getPercentage() == false){
			fn();
		}else{
			setTimeout(function(){
				that.loaded(fn);
			},20);
		}
	};
	
	return new Preloader();
});