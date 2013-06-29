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
	requirejs(["Client/Main"], function(client){
		client();
	});	
}