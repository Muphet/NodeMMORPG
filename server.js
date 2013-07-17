var Loader = require(__dirname+'/lib/loader');
var io = require('socket.io').listen(99, {log:false});

Loader(['lib/Server/Factory', 'lib/Server/Clients', 'lib/Server/Player', 'game/Entities/Server/Animation'], function(Factory, Clients, Player, AnimationEntity){
	var e = new AnimationEntity();
	var p = new AnimationEntity();
	Factory.spawn(p);
	p.join('main');
	p.join('sub');
	setInterval(function(){
		Factory.despawn(e);
		e = new AnimationEntity();
		e.join('main');
		Factory.spawn(e);
	}, 3000);
	
	
	io.sockets.on('connection', function(socket){
		var p = new Player(socket);
		Clients.subscribe(p);
		p.join('main');
		//Factory.sync(p);
		setTimeout(function(){
			p.leave('main');
			p.join('sub');
		}, 10000);
		socket.on('disconnect', function(){
			Clients.unscribe(p);
		});
	});
});