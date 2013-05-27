if(typeof(window) === "undefined"){
	var requirejs = require('requirejs');
	
	requirejs.config({
		baseUrl: __dirname,
		nodeRequire: require
	});
	
	module.exports = requirejs;
}else{
	requirejs.config({
		baseUrl: 'lib', // By default, load all from vendor folder
		shim: {
			backbone: { // Do not support module loading
				deps: ['underscore', 'jquery'], // Do not support module loading
				exports: 'Backbone' 
			},
			underscore: {
				exports: '_'
			},
			createjs: {
				exports: 'createjs'
			},
			jquery: {
				exports: '$'
			}
		},
		paths: {
			jquery: '3rdparty/jquery-min',
			underscore: '3rdparty/underscore-min',
			createjs: '3rdparty/easeljs-min',
			backbone: '3rdparty/backbone-min',
		}
	});
	
	requirejs(['Client/ResponsiveStage','Client/HTMLElement','createjs'], function(ResponsiveStage, HTMLElement, createjs){
		var s = new ResponsiveStage(document.getElementById('canvas'),800,600);
		var b = new createjs.Bitmap('static/images/splash/alert_demo1.png');
		var i = new createjs.Bitmap('static/images/ui/loading.png');
		var f = new createjs.Container();
		var d1 = $('<div><input type="text" name="username" placeholder="Username" value="" style="width:100px;height:50px;" /></div>')[0];
		$('body').append(d1);
		var d = new HTMLElement(d1);
		d.x = 400;
		d.y = 300;
		f.addChild(d);
		s.addChild(f);
		s.addChild(b);
		s.addChild(i);
		
		i.x = 200;
		i.y = 200;
		i.addEventListener("click", function(){
			console.log('xD');
			d.visible = (d.visible ? false : true);
			i.x = Math.random()*700;
			i.y = Math.random()*500;
		});
		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener("tick", function(delta){
			s.update();
		});
	});
}