function World(gs) {
	var iso = this.iso = new Isometric();
	iso.set_screen_object(gs);
	var player = gs.addEntity(new Player(gs, this));
	
	this.update = function() {
		
	}
	
	this.draw = function(c) {
		// draw the grid
		for (var gx=-10; gx<11; gx++) {
			var start = iso.w2s([gx, -10]);
			var end = iso.w2s([gx, 10]);
			c.strokeStyle = "#aca";
			c.beginPath();
			c.moveTo(start[0], start[1]);
			c.lineTo(end[0], end[1]);
			c.closePath();
			c.stroke();
		}
		for (var gy=-10; gy<11; gy++) {
			var start = iso.w2s([-10, gy]);
			var end = iso.w2s([10, gy]);
			c.strokeStyle = "#aca";
			c.beginPath();
			c.moveTo(start[0], start[1]);
			c.lineTo(end[0], end[1]);
			c.closePath();
			c.stroke();
		}
	}
}
