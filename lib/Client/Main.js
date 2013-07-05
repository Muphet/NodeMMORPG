define(['lib/Client/GameCanvas', 'lib/Client/SceneManager', 'lib/Client/Package', 'lib/Client/Factory', 'lib/Client/TiledMapBuilder', 'jquery', 'lib/Client/Stats'], function(GameCanvas, SceneManager, Package, Factory, TiledMapBuilder, $, Stats){
	return function(){
		Package.load(function(){
			SceneManager.store('offline', new (requirejs('game/Scenes/Offline'))());
			
			if(typeof(io) === "undefined"){
				SceneManager.open('offline');
			}else{
				console.log("Connecting...");
				var socket = io.connect('http://localhost:99/');
				socket.on('connect', function(){
					SceneManager.close('offline');
				});
				socket.on('disconnect', function(){
					SceneManager.open('offline');
				});
				Factory.listen(socket);
			}
			
			/*$.ajax({
				dataType: "json",
				url: "game/Maps/map.json",
				data: {},
				success: function(data){
					console.log(data);
					map = new TiledMapBuilder(data);
					map.addEventListener("tick", function(){
						map.x--;
						map.y--;
					});
					GameCanvas.addChild(map);
					
					console.log(map);
				}
			});
			*/
			
			var stats = new Stats();
			stats.setMode(0);
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.left = '0px';
			stats.domElement.style.top = '0px';
			
			document.body.appendChild( stats.domElement );
			
			createjs.Ticker.setFPS(30);
			createjs.Ticker.addEventListener("tick", function(delta){
				stats.begin();
				SceneManager.tick(delta);
				GameCanvas.update();
				stats.end();
			});
		});
	};
});
