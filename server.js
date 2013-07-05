var Loader = require(__dirname+'/lib/loader');
var io = require('socket.io').listen(99);

Loader(['lib/Server/Factory', 'lib/Server/Player', 'game/Entities/Server/Animation'], function(Factory, Player, AnimationEntity){
	var e = new AnimationEntity();
	setInterval(function(){
		e.set('variable','Test!');
		Factory.despawn(e);
		e = new AnimationEntity();
		e.join('main');
		Factory.spawn(e);
	}, 3000);
	io.sockets.on('connection', function(socket){
		var p = new Player(socket);
		p.join('main');
		Factory.subscribe(p);
		socket.on('disconnect', function(){
			Factory.unscribe(p);
		});
	});
});