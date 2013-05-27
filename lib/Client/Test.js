define(['Client/ResponsiveStage','Client/InputElement','createjs'], function(ResponsiveStage, HTMLElement, createjs){
	return function(){
		var s = new ResponsiveStage(document.getElementById('canvas'),800,600);
		var b = new createjs.Bitmap('static/images/splash/alert_demo1.png');
		var i = new createjs.Bitmap('static/images/ui/loading.png');
		var f = new createjs.Container();
		var d1 = $('<div><input type="text" name="username" placeholder="Username" value="" style="width:100px;height:50px;" /></div>')[0];
		$('body').append(d1);
		var d = new HTMLElement(d1);
		d.x = 400;
		d.y = 300;
		f.addChild(d);
		s.addChild(f);
		s.addChild(b);
		s.addChild(i);
		
		i.x = 200;
		i.y = 200;
		i.addEventListener("click", function(){
			console.log('xD');
			d.visible = (d.visible ? false : true);
			i.x = Math.random()*700;
			i.y = Math.random()*500;
		});
		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener("tick", function(delta){
			s.update();
		});
	};
});
