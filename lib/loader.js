if(typeof(window) === "undefined"){
	var requirejs = require('requirejs');
	
	requirejs.config({
		baseUrl: __dirname+"/../",
		nodeRequire: require
	});
	
	module.exports = requirejs;
}else{
	requirejs.config({
		baseUrl: '',
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
			jquery: 'lib/3rdparty/jquery-min',
			underscore: 'lib/3rdparty/underscore-min',
			createjs: 'lib/3rdparty/easeljs-min',
			backbone: 'lib/3rdparty/backbone-min',
		}
	});
	requirejs(["lib/Client/Main"], function(client){
		client();
	});	
}