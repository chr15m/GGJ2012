function World(gs) {
	var iso = this.iso = new Isometric();
	iso.set_screen_object(gs);
	var player = gs.addEntity(new Player(gs, this));
	this.shadow = (new Sprite(["center", "center"], {"default": [["res/img/shadow.png", 3]]})).action("default");
	this.map = new Map();
	this.map.set_rectangle([]);
	
	function rounder(i, e) {
		return Math.round(e);
	}
	
	this.update = function() {
		
	}
	
	this.draw = function(c) {
		// draw the background grid
		var bounds = iso.s2w([gs.width / 2, -gs.height / 2]).each(rounder).each(function(i,e){ return e - 0.5;});
		c.strokeStyle = "#aca";
		c.beginPath();
		for (var gx=bounds[0]; gx<-bounds[0] + 1; gx++) {
			var start = iso.w2s([gx, -bounds[1]]);
			var end = iso.w2s([gx, bounds[1]]);
			c.moveTo(start[0], start[1]);
			c.lineTo(end[0], end[1]);
		}
		for (var gy=-bounds[1]; gy<bounds[1] + 1; gy++) {
			var start = iso.w2s([-bounds[0], gy]);
			var end = iso.w2s([bounds[0], gy]);
			c.moveTo(start[0], start[1]);
			c.lineTo(end[0], end[1]);
		}
		c.closePath();
		c.stroke();
		
		// draw highlighted square
		this.draw_square(c, iso.s2w(gs.pointerPosition).each(rounder));

	}
	
	this.pointerBox = function() {
		return [0, 0, gs.width, gs.height];
	}
	
	this.pointerDown = function(i) {
		player.moveTo(
			iso.s2w(gs.pointerPosition).each(rounder)
		);
	}
	
	this.pointerMove = function() {
		
	}
	
	this.pointerUp = function(i) {
		
	}
	
	/*** Fill in a square with a colour. ***/
	this.draw_square = function(c, sqr) {
		var corners = [
			iso.w2s([sqr[0] - 0.5, sqr[1] - 0.5]),
			iso.w2s([sqr[0] - 0.5, sqr[1] + 0.5]),
			iso.w2s([sqr[0] + 0.5, sqr[1] + 0.5]),
			iso.w2s([sqr[0] + 0.5, sqr[1] - 0.5])
		];
		c.fillStyle = "rgba(170, 204, 170, 0.5)";
		c.beginPath();
		c.moveTo(corners[0][0], corners[0][1]);
		c.lineTo(corners[1][0], corners[1][1]);
		c.lineTo(corners[2][0], corners[2][1]);
		c.lineTo(corners[3][0], corners[3][1]);
		c.closePath();
		c.fill();
	}
}
