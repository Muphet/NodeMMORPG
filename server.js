var Loader = require(__dirname+'/lib/loader');
var io = require('socket.io').listen(99);

Loader(['Server/Factory', 'Server/Player', 'Server/Entity'], function(Factory, Player, Entity){
	var e = new Entity();
	setInterval(function(){
		e.set('variable','Test!');
		Factory.despawn(e);
		e = new Entity();
		e.join('main');
		Factory.spawn(e);
	}, 3000);
	io.sockets.on('connection', function(socket){
		var p = new Player(socket);
		p.join('main');
		console.log(p.channels);
		Factory.subscribe(p);
		socket.on('disconnect', function(){
			Factory.unscribe(p);
		});
	});
});