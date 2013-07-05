define(['createjs', 'lib/Shared/Logger', 'jquery'], function(createjs, Logger, $){
	/**
	* An extension to easeljs Stage, it resizes itself, and it takes a max_width and max_height parameter.
	* @module lib
	* @submodule lib_Client
	* @extends Stage
	* @class lib_Client_ResponsiveStage
	* @constructor
	* @param element {HTMLElement} Stage <canvas> HTML Element.
	* @param max_width {Integer} Max Stage width, above will be max screen size.
	* @param max_height {Integer} Max Stage height, above will be max screen size.
	* @param ignore_max {Boolean} Ignore max dimensions and apply fullscreen canvas.
	**/
	function ResponsiveStage(element, max_width, max_height, ignore_max){
		this.initialize(element, max_width || 800, max_height || 600, ignore_max || false);
	}
	
	var p = ResponsiveStage.prototype = new createjs.Stage();
	p.Stage_initialize = p.initialize;
	
	/**
	* @protected
	**/
	p.initialize = function(element, max_width, max_height, ignore_max){
		this.Stage_initialize(element);
		var that = this;
		that.el = element;
		var fn = function(){
			var w = $('body').width();
			var h = $('body').height();
			if((w < max_width) || ignore_max == true){
				w0 = w;
			}else{
				w0 = max_width;
			}
			if((h < max_height) || ignore_max == true){
				h0 = h;
			}else{
				h0 = max_height;
			}
			that.el.width = w0;
			that.el.height = h0;
			that.scaleX = w0/max_width;
			that.scaleY = h0/max_height;
			// Pixelated mode in FF and Chrome, I like it!
			that.el.getContext('2d').mozImageSmoothingEnabled = false;
			that.el.getContext('2d').webkitImageSmoothingEnabled = false;
			that.enableMouseOver = 5; // Check mouseover less times, speed up canvas!
			Logger.getLogger("ResponsiveStage").debug("Resizing Canvas HTML element...");
		};
		$(window).resize(fn);
		fn();
	};
	return ResponsiveStage;
});