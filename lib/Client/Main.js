define(['Client/GameCanvas', 'Client/SceneManager', 'Client/Scene/Offline', 'Client/Factory'], function(GameCanvas, SceneManager, OfflineScene, Factory){
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
		
		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener("tick", function(delta){
			SceneManager.tick();
			GameCanvas.update();
		});
	};
});
