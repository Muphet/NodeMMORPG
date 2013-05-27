define(['createjs', 'jquery'], function(createjs, $){
	/**
	* An extension to easeljs Stage, it resizes itself, and it takes a max_width and max_height parameter.
	* @extends Stage
	* @class ResponsiveStage
	* @constructor
	* @param element {HTMLElement} Stage <canvas> HTML Element.
	* @param max_width {Integer} Max Stage width, above will be max screen size.
	* @param max_height {Integer} Max Stage height, above will be max screen size.
	**/
	function ResponsiveStage(element, max_width, max_height){
		this.initialize(element, max_width || 800, max_height || 600);
	}
	
	var p = ResponsiveStage.prototype = new createjs.Stage();
	p.Stage_initialize = p.initialize;
	
	/**
	* @protected
	**/
	p.initialize = function(element, max_width, max_height){
		this.Stage_initialize(element);
		var that = this;
		that.el = element;
		
		var fn = function(){
			var w = $('body').width();
			var h = $('body').height();
			if(w < max_width){
				w0 = w;
			}else{
				w0 = max_width;
			}
			if(h < max_height){
				h0 = h;
			}else{
				h0 = max_height;
			}
			that.el.width = w0;
			that.el.height = h0;
			that.scaleX = w0/max_width;
			that.scaleY = h0/max_height;
		};
		$(window).resize(fn);
		fn();
	};
	return ResponsiveStage;
});