function Player(gs, world) {
	this.priority = 10;
	this.position = [0, 0];
	this.destination = [0, 0];
	this.close_threshold = 0.03;
	this.velocity = 0.01;
	
	var sprite = new Sprite(["center", "bottom"], {
		"down-left": [
			["res/img/player-left-down.png", 3]
		],
		"down-right": [
			["res/img/player-right-down.png", 3]
		],
		"up-left": [
			["res/img/player-left-up.png", 3]
		],
		"up-right": [
			["res/img/player-right-up.png", 3]
		]
	});
	
	this.init = function() {
		sprite.action("down-right");
	}
	
	this.update = function() {
		// do we need to move closer
		if (this.destination[0] != this.position[0] || this.destination[1] != this.position[1]) {
			
		}
	}
	
	this.draw = function(c) {
		world.shadow.draw(c, world.iso.w2s([this.position[0], this.position[1], 0]));
		sprite.draw(c, world.iso.w2s([this.position[0], this.position[1], 0.3]));
	}
	
	this.moveTo = function(pos) {
		this.position = pos;
	}
}
