define(['jquery','Client/ResponsiveStage'], function($, ResponsiveStage){
	var a = new ResponsiveStage(document.getElementById('canvas'),640,360,true); // 16:9 halfed screen size
	return a;
});