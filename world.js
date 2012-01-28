function World(gs) {
	var iso = this.iso = new Isometric();
	iso.set_screen_object(gs);
	var player = gs.addEntity(new Player(gs, this));
	
	this.update = function() {
		
	}
	
	this.draw = function(c) {
		var bounds = iso.s2w([-gs.width / 2, gs.height / 2]);
		// draw the grid - profiled at 70% on my laptop - ridiculous!
		c.strokeStyle = "#aca";
		c.beginPath();
		for (var gx=-10; gx<11; gx++) {
			var start = iso.w2s([gx, -bounds[1]]);
			var end = iso.w2s([gx, bounds[1]]);
			c.moveTo(start[0], start[1]);
			c.lineTo(end[0], end[1]);
		}
		for (var gy=-10; gy<11; gy++) {
			var start = iso.w2s([-bounds[0], gy]);
			var end = iso.w2s([bounds[0], gy]);
			c.moveTo(start[0], start[1]);
			c.lineTo(end[0], end[1]);
		}
		c.closePath();
		c.stroke();
	}
	
	this.pointerBox = function() {
		return [0, 0, gs.width, gs.height];
	}
	
	this.pointerDown = function(i) {
		player.moveTo(iso.s2w(gs.pointerPosition));
	}
	
	this.pointerMove = function() {
		
	}
	
	this.pointerUp = function(i) {
		
	}
}
