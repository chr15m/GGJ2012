function World(gs) {
	var fieldsize = this.fieldsize = [32, 32];
	
	this.priority = 0;
	var iso = this.iso = new Isometric();
	iso.set_screen_object(gs);
	
	this.shadow = (new Sprite(["center", "center"], {"default": [["res/img/shadow.png", 3]]})).action("default");
	
	this.map = new Map(gs, this, fieldsize);
	var player = gs.addEntity(new Player(gs, this)).set_position([fieldsize[0] / 2, fieldsize[1] / 2]);
	
	var loadnew = true;
	
	var clrs = {
		"water": "rgb(70, 70, 204)",
		"road": "rgb(70, 70, 70)",
		"sand": "rgb(204, 204, 70)",
		"trees": "rgb(180, 255, 180)",
		"grass": "rgb(180, 255, 180)",
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
		gs.background(clrs["grass"]);
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
		
		// draw background tiles according to what is on them.
		var field = this.map.bounds;
		for (var x=field[0]; x<field[0] + field[2]; x++) {
			for (var y=field[1]; y<field[1] + field[3]; y++) {
				//console.log(clrs[this.map.get_tile(x, y)]);
				if (x >= 0 && y >= 0 && x < fieldsize[0] && y < fieldsize[1]) {
					var tile = this.map.get_tile(x, y);
					if (tile != "grass" && tile != "trees") {
						this.draw_square(c, [x,y], clrs[tile]);
					}
				}
			}
		}
		// draw highlighted square
		var isopointer = iso.s2w(gs.pointerPosition).each(Math.round);
		if (isopointer[0] >= 0 && isopointer[1] >= 0 && isopointer[0] < fieldsize[0] && isopointer[1] < fieldsize[1]) {
			this.draw_square(c, isopointer, "rgba(255, 255, 255, 0.5)");
		}
	}
	
	this.pointerBox = function() {
		return [0, 0, gs.width, gs.height];
	}
	
	this.pointerDown = function(i) {
		var newsquare = iso.s2w(gs.pointerPosition).each(Math.round);
		if (newsquare[0] >= 0 && newsquare[1] >= 0 && newsquare[0] < fieldsize[0] && newsquare[1] < fieldsize[1]) {
			player.move_to(newsquare);
		}
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
