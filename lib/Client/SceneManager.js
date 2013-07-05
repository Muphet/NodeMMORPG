define(['lib/Client/Scene', 'lib/Shared/Logger'], function(Scene, Logger){
	/**
	* Manages different scenes on canvas.
	* @module lib
	* @submodule lib_Client
	* @class lib_Client_SceneManager
	* @constructor
	**/
	function SceneManager(){
		this.initialize();
	}
	
	var p = SceneManager.prototype;
	
	/**
	* Holds all scenes.
	* @property scenes
	**/
	p.scenes = {};
	
	/**
	* Holds current scene, as instance or string.
	* @property current
	**/
	p.current = false;
	
	/**
	* Initialize
	* @method initialize
	**/
	p.initialize = function(){
		this.scenes = {};
		this.current = false;
	};
	
	/**
	* Get current scene, if string passed, returns correlated scene, if exists.
	* @method get
	* @param namespace {String} Scene to get.
	**/
	p.get = function(namespace){
		if(typeof(namespace) === "undefined"){
			if(this.current === false || (typeof(this.current) === "string" && typeof(this.scenes[this.current]) === "undefined")){
				return false;
			}else{
				if(typeof(this.current) === "string"){
					return this.scenes[this.current];
				}else{
					return this.current;
				}
			}
		}else{
			if(typeof(this.scenes[namespace]) === "undefined"){
				return false;
			}else{
				return this.scenes[this.current];
			}
		}
	};
	
	/**
	* Runs a tick on currently opened scene.
	* @method tick
	**/
	p.tick = function(delta){
		if(typeof(this.get().tick) === "function"){
			this.get().tick(delta);
		}
	};
	
	/**
	* Opens a Scene, it creates it and open it if instance passed.
	* @method open
	* @param scene {String|Scene} String namespace or Scene to open.
	**/
	p.open = function(scene){
		if((typeof(scene) === "string" && this.get(scene) !== false) || typeof(scene) === "object"){
			// Trigger close on current scene.
			if(this.get() !== false && typeof(this.get().close) === "function"){
				Logger.getLogger("SceneManager").debug("Closing Scene#"+this.get().uuid);
				this.get().close();
			}
			this.current = scene;
			if(typeof(scene) === "object"){
				// Trigger create on new scene.
				if(typeof(this.get().create) === "function"){
					Logger.getLogger("SceneManager").debug("Creating Scene#"+this.get().uuid);
					this.get().create();
				}
			}
		}
		// Trigger open on new scene.
		if(typeof(this.get().open) === "function"){
			Logger.getLogger("SceneManager").debug("Opening Scene#"+this.get().uuid);
			this.get().open();
		}
	};
	
	/**
	* Closes current opened scene.
	* @method close
	* @param scene {String|Scene} String namespace or Scene to close.
	**/
	p.close = function(scene){
		if((typeof(scene) === "string" && this.get(scene) !== false) || typeof(scene) === "object"){
			// Trigger close on current scene.
			if(this.get() !== false && typeof(this.get().close) === "function"){
				Logger.getLogger("SceneManager").debug("Closing Scene#"+this.get().uuid);
				this.get().close();
			}
		}
	};
	
	/**
	* Store an instances and open it up later. It triggers create anyway.
	* @method store
	* @param namespace {String} Namespace for the scene.
	* @param scene {Scene} Scene to save as namespace.
	**/
	p.store = function(namespace, scene){
		this.scenes[namespace] = scene;
		if(typeof(this.scenes[namespace].create) === "function"){
			Logger.getLogger("SceneManager").debug("Creating Scene#"+this.get().uuid);
			this.scenes[namespace].create();
		}
	}
	return new SceneManager();
});