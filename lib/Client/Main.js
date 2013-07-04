var map;
define(['Client/GameCanvas', 'Client/SceneManager', 'Client/Scene/Offline', 'Client/Factory', 'Client/TiledMapBuilder', 'jquery', 'Client/Stats'], function(GameCanvas, SceneManager, OfflineScene, Factory, TiledMapBuilder, $, Stats){
	return function(){
		SceneManager.store('offline', new OfflineScene());
		
		if(typeof(io) === "undefined"){
			SceneManager.open('offline');
		}else{
			var socket = io.connect('http://192.168.1.69:99/');
			socket.on('connect', function(){
				SceneManager.close('offline');
			});
			socket.on('disconnect', function(){
				SceneManager.open('offline');
			});
			Factory.listen(socket);
		}
		
		$.ajax({
			dataType: "json",
			url: "resource/map.json",
			data: {},
			success: function(data){
				console.log(data);
				map = new TiledMapBuilder(data);
				GameCanvas.addChild(map.sprite);
				console.log(map);
			}
		});
		
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
	};
});
