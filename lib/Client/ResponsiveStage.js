define(['createjs', 'jquery'], function(createjs, $){
	function ResponsiveStage(element, ratio, max_width){
		this.initialize(element, ratio || 1, max_width || 800);
	}
	
	var p = ResponsiveStage.prototype = new createjs.Stage();
	p.Stage_initialize = p.initialize;
	
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