define(['Client/ResponsiveStage','Client/InputElement','createjs','jquery','Client/Preloader','Client/Scene', 'Client/SceneManager'], function(ResponsiveStage, HTMLElement, createjs, $, Preloader, Scene, SceneManager){
	return function(){
		var socket = io.connect('http://localhost:99/');
		socket.on('factory:spawn', function(data){
			console.log('spawn', data);
		});
		socket.on('factory:despawn', function(data){
			console.log('despawn', data);
		});
		socket.on('factory:update', function(data){
			console.log('update', data);
		});
		Preloader.appendManifest({
			"logo": "static/images/ui/loading.png",
			"bars": "static/images/ui/bars.png",
			"natsu": "static/images/npcs/natsu.png"
		});
		Preloader.loaded(function(){
			var s = new ResponsiveStage(document.getElementById('canvas'),640,360,true); // 16:9 halfed screen size
			
			function SceneA(){}
			var p =SceneA.prototype;
			
			p.create = function(){
				this.logo =  new createjs.Bitmap(Preloader.get("logo"));
				this.logo.x = 200;
				this.logo.y = 200;
				this.logo.regX = this.logo.regY = 16;
			};
			
			p.tick = function(){
				this.logo.rotation++;
			};
			
			p.open = function(){
				s.addChild(this.logo);
			};
			
			p.close = function(){
				s.removeChild(this.logo);
			};
			
			function SceneB(){}
			var p =SceneB.prototype;
			
			p.create = function(){
				this.bars = new createjs.SpriteSheet({
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
				this.natsu = new createjs.SpriteSheet({
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
				
				this.hp = new createjs.BitmapAnimation(this.bars);
				this.hp.gotoAndPlay("test");
				this.hp.x = this.hp.y = 100;
				this.actor = new createjs.BitmapAnimation(this.natsu);
				this.actor.gotoAndPlay("test");
				this.actor.x = 100;
				this.actor.y = 115;
			};
			
			p.open = function(){
				s.addChild(this.hp);
				s.addChild(this.actor);
			};
			
			p.close = function(){
				s.removeChild(this.hp);
				s.removeChild(this.actor);
			};
			
			
			SceneManager.store('map', new SceneB());
			SceneManager.store('menu', new SceneA());
			SceneManager.open('menu');
			setTimeout(function(){SceneManager.open('map');}, 3000);
			setTimeout(function(){SceneManager.open('menu');}, 6000);
			createjs.Ticker.setFPS(30);
			createjs.Ticker.addEventListener("tick", function(delta){
				SceneManager.tick();
				s.update();
			});
		});
	};
});
