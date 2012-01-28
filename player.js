function Player(gs, world) {
	this.priority = 10;
	this.position = vectorize([0, 0]);
	this.destination = vectorize([0, 0]);
	this.close_threshold = 0.1;
	this.velocity = 0.1;
	
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
		if (this.position != this.destination) {
			// get the vector pointing towards the destination
			var towards = vectorize(this.destination.slice()).subtract(this.position);
			if (towards.abs() < this.close_threshold) {
				this.position = this.destination;
			} else {
				this.position.add(towards.unit().multiply(this.velocity));
			}
		}
	}
	
	this.draw = function(c) {
		world.shadow.draw(c, world.iso.w2s([this.position[0], this.position[1], 0]));
		sprite.draw(c, world.iso.w2s([this.position[0], this.position[1], 0.3]));
	}
	
	this.moveTo = function(pos) {
		this.destination = vectorize(pos.slice());
	}
}
