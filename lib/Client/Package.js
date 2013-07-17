define(['jquery','lib/Client/Entity','lib/Shared/Logger'], function($, Entity, Logger){
	/**
	* Loads Package info.
	* @module lib
	* @submodule lib_Client
	* @class lib_Client_Package
	* @constructor
	**/
	function Package(){
		
	}
	var p = Package.prototype;
	
	/**
	* Store package.json
	* @property json
	**/
	p.json = {};
	
	/**
	* Loads modules and calls a callback once all is loaded.constructor
	* @method loadModules
	* @param modules {Array} Modules to load.
	* @param fn {Function} Callback once all is loaded.
	* @param fn2 {Function} Callback once one module is loaded.
	* @param loaded {Integer} Number of modules of array loaded.
	**/
	p.loadModules = function(modules, fn, fn2, loaded){
		if(typeof(loaded) === "undefined"){ var loaded = 0; }
		if(typeof(fn2) === "undefined"){ var fn2 = function(){}; }
		
		if(modules.length > 0){
			if(modules.length < loaded){
				if(typeof(fn) === "function"){
					fn();
				}
			}else{
				Logger.getLogger("Package").info("Loading module... "+modules[loaded]);
				if(require.defined(modules[loaded])){
					loaded++;
					this.loadModules(modules, fn, fn2, loaded);
				}else{
					var that = this;
					require([modules[loaded]],function(){
						fn2(modules[loaded]);
						loaded++;
						that.loadModules(modules, fn, fn2, loaded);
					});
				}
			}
		}
	};
	
	/**
	* Loads package.json and calls callbacks
	* @method load
	* @param fn {Function} Callback on complete.
	* @param fn2 {Function} Callback on step.
	**/
	p.load = function(fn, fn2){
		var that = this;
		$.ajax({
			dataType: "json",
			url: "game/package.json",
			data: {},
			success:function(data){
				that.json = data;
				var modules = [];
				for(var key in data){
					for(var i = 0; i < data[key].length; i++){
						if(key.toLowerCase() === "entities"){
							modules.push('game/Entities/Client/'+data[key][i]);
						}
						if(key.toLowerCase() === "scenes"){
							modules.push('game/Scenes/'+data[key][i]);
						}
					}
				}
				that.loadModules(modules, fn, fn2);
			}
		});
	};
	
	/**
	* By a given name, returns entity class.
	* @method entities
	* @param name {String} Entity name.
	**/
	p.entities = function(name){
		if(typeof(this.json['Entities']) === "undefined"){
			throw "No entities loaded.";
			return false;
		}
		if(require.defined('game/Entities/Client/'+name)){
			return require('game/Entities/Client/'+name) || Entity;
		}
		return Entity;
	};
	
	/**
	* By a given name, returns scene class.
	* @method scenes
	* @param name {String} Scene name.
	**/
	p.scenes = function(name){
		if(typeof(this.json['Scenes']) === "undefined"){
			throw "No scenes loaded.";
			return false;
		}
		if(require.defined('game/Scenes/'+name)){
			return require('game/Scenes/'+name) || Scene;
		}
		return Scene;
	};
	
	/**
	* Returns whatever debug is on or off. True by default. Debug will show more console errors and FPS ticker.
	* @method debugEnabled
	**/
	p.debugEnabled = function(){
		return this.json.debug || true;
	};
	
	return new Package();
});