define(['lib/Client/GameCanvas','lib/Client/Scene','createjs'], function(GameCanvas, Scene, createjs){
	/**
	* Defines an offline screen
	* @constructor
	* @class OfflineScene
	* @extends Scene
	**/
	function OfflineScene(){}
	var p = OfflineScene.prototype = new Scene();
	
	p.create = function(){
		this.screen = new createjs.Bitmap("game/Graphics/UI/offline.png");
		this.screen.regX = this.screen.regY = this.screen.x = this.screen.y = 0;
	};
	
	p.open = function(){
		GameCanvas.addChild(this.screen);
	};
	
	p.close = function(){
		GameCanvas.removeChild(this.screen);
	};
	
	return OfflineScene;
});