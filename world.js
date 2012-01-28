function World(gs) {
	var iso = this.iso = new Isometric();
	iso.set_screen_object(gs);
	var player = gs.addEntity(new Player(gs, this));
	this.shadow = (new Sprite(["center", "center"], {"default": [["res/img/shadow.png", 3]]})).action("default");
	this.map = new Map(gs, this);
	var loadnew = true;
	
	var clrs = {
		"water": "rgba(170, 170, 204, 0.5)",
		"road": "rgba(50, 50, 50, 0.75)",
		"sand": "rgba(204, 204, 170, 0.75)",
		"trees": "rgba(170, 204, 170, 0.75)",
		"grass": "rgba(180, 255, 180, 0.75)",
	};
	
	function rounder(i, e) {
		return Math.round(e);
	}
	
	this.update = function() {
		// set the camera on the player
		iso.set_focus(player.position);
		// "load" a new section of the randomly generated map
		if (loadnew) {
			// screen bounds in the isometric world
			var corners = [
				iso.s2w([0, 0]).each(Math.round),
				iso.s2w([0, gs.height]).each(Math.round),
				iso.s2w([gs.width, 0]).each(Math.round),
				iso.s2w([gs.width, gs.height]).each(Math.round)
			];
			// calculate the field we want to load from the map
			this.map.set_rectangle([corners[0][0] - 1, corners[1][1] - 1, corners[3][0] - corners[0][0] + 3, corners[2][1] - corners[1][1] + 3]);
			loadnew = false;
		}
		if (player.changed_square()) {
			loadnew = true;
		}
		gs.sortEntities();
	}
	
	this.draw = function(c) {
		// draw the background grid
		/*var bounds = iso.s2w([gs.width / 2, -gs.height / 2]).each(rounder).each(function(i,e){ return e - 0.5;});
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
		c.stroke();*/
		
		// draw highlighted square
		this.draw_square(c, iso.s2w(gs.pointerPosition).each(Math.round), "rgba(255, 255, 255, 0.75)");
		// draw background tiles according to what is on them.
		var field = this.map.bounds;
		for (var x=field[0]; x<field[0] + field[2]; x++) {
			for (var y=field[1]; y<field[1] + field[3]; y++) {
				//console.log(clrs[this.map.get_tile(x, y)]);
				this.draw_square(c, [x,y], clrs[this.map.get_tile(x, y)]);
			}
		}
	}
	
	this.pointerBox = function() {
		return [0, 0, gs.width, gs.height];
	}
	
	this.pointerDown = function(i) {
		player.move_to(iso.s2w(gs.pointerPosition).each(Math.round));
		loadnew = true;
	}
	
	this.pointerMove = function() {
		
	}
	
	this.pointerUp = function(i) {
		
	}
	
	/*** Fill in a square with a colour. ***/
	this.draw_square = function(c, sqr, color) {
		var corners = [
			iso.w2s([sqr[0] - 0.5, sqr[1] - 0.5]),
			iso.w2s([sqr[0] - 0.5, sqr[1] + 0.5]),
			iso.w2s([sqr[0] + 0.5, sqr[1] + 0.5]),
			iso.w2s([sqr[0] + 0.5, sqr[1] - 0.5])
		];
		c.fillStyle = color;
		c.beginPath();
		c.moveTo(corners[0][0], corners[0][1]);
		c.lineTo(corners[1][0], corners[1][1]);
		c.lineTo(corners[2][0], corners[2][1]);
		c.lineTo(corners[3][0], corners[3][1]);
		c.closePath();
		c.fill();
	}
}
