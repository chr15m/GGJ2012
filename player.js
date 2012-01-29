function Player(gs, world) {
	this.priority = 10;
	this.position = vectorize([0, 0]);
	this.destination = vectorize([0, 0]);
	this.velocity = 0.15;
	this.last_square = vectorize([0, 0]);
	
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
			if (towards.abs() <= this.velocity) {
				this.position = this.destination;
			} else {
				this.position.add(towards.unit().multiply(this.velocity));
				towards.unit();
				var angle = Math.atan2(towards[1], towards[0]);
				var direction = (angle < Math.PI * .25 && angle > Math.PI * -.75 ? "down" : "up") + "-" + (angle < Math.PI * -0.25 || angle > Math.PI * 0.75 ? "left" : "right");
				sprite.action(direction);
			}
		}
		this.priority = world.iso.w2s(this.position)[1];
	}
	
	this.draw = function(c) {
		world.shadow.draw(c, world.iso.w2s(this.position));
		sprite.draw(c, world.iso.w2s([this.position[0], this.position[1], 0.3 + Math.sin(gs.frameCount * 0.25) * 0.01]));
	}
	
	this.move_to = function(pos) {
		this.destination = vectorize(pos.slice());
	}
	
	this.set_position = function(pos) {
		this.destination = this.position = vectorize(pos);
		return this;
	}
	
	this.changed_square = function() {
		var currentsquare = this.position.slice().each(Math.round);
		if (!this.last_square.equals(currentsquare)) {
			this.last_square = vectorize(currentsquare);
			return true;
		}
	}
}
