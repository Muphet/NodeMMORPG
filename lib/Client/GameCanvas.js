define(['jquery','lib/Client/ResponsiveStage'], function($, ResponsiveStage){
	/**
	* Singleton of a ResponsiveStage
	* @module lib
	* @submodule lib_Client
	* @class lib_Client_GameCanvas
	* @constructor
	**/
	var a = new ResponsiveStage(document.getElementById('canvas'),640,360,true); // 16:9 halfed screen size
	return a;
});