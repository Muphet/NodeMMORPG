define(function(){
	/**
	* Preloads any image.
	* @class Preloader
	* @constructor
	**/
	function Preloader(){
		this.initialize();
	}
	
	var p = Preloader.prototype;
	
	/*
	* @method initialize
	* @protected
	**/
	p.initialize = function(){
		this.entries = [];
	};
	
	return Preloader;
});