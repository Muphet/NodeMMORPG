define(['Client/ResponsiveStage','Client/InputElement','createjs','jquery','Client/Preloader'], function(ResponsiveStage, HTMLElement, createjs, $, Preloader){
	return function(){
		Preloader.appendManifest({
			"logo": "static/images/ui/loading.png",
			"bars": "static/images/ui/bars.png",
			"natsu": "static/images/npcs/natsu.png"
		});
		Preloader.loaded(function(){
			var s = new ResponsiveStage(document.getElementById('canvas'),640,360,true); // 16:9 halfed screen size
			var i = new createjs.Bitmap(Preloader.get("logo"));
			s.addChild(i);
			
			i.x = 200;
			i.y = 200;
			
			var ss = new createjs.SpriteSheet({
				"frames": {
					"width": 32,
					"regX": 16,
					"regY": 4,
					"height": 9,
				},
				"animations": {
					"test": { "frames":[0,2,4,6,8,10,12,14,18,20],"frequency":6},
					"test2": { "frames":[1,3,5,7,9,11,13,15,17,19],"frequency":6}
				},
				"images": [Preloader.get("bars")]
			});
	
			var ss1 = new createjs.SpriteSheet({
				"frames": {
					"width": 32,
					"regX": 16,
					"regY": 0,
					"height": 32,
				},
				"animations": {
					"test": { "frames":[0,1,2,1],"frequency":8},
				},
				"images": [Preloader.get("natsu")]
			});
			
			var bitmapAnimation = new createjs.BitmapAnimation(ss);
			bitmapAnimation.gotoAndPlay("test");
			bitmapAnimation.x = bitmapAnimation.y = 100;
			s.addChild(bitmapAnimation);
			var bitmapAnimation = new createjs.BitmapAnimation(ss);
			bitmapAnimation.gotoAndPlay("test2");
			bitmapAnimation.x = 100;
			bitmapAnimation.y = 106;
			s.addChild(bitmapAnimation);
			var bitmapAnimation = new createjs.BitmapAnimation(ss1);
			bitmapAnimation.gotoAndPlay("test");
			bitmapAnimation.x = 100;
			bitmapAnimation.y = 115;
			s.addChild(bitmapAnimation);
			
			createjs.Ticker.setFPS(30);
			createjs.Ticker.addEventListener("tick", function(delta){
				s.update();
			});
		});
	};
});
