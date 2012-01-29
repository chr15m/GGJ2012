function Critter(gs, world, pos, random, npcs) {
	// this critter is a statemachine
	statemachine(this);
	var statenames = ["mushroom", "floaty", "ghost"];
	var anim = ["mushroom-1", "floaty", "ghost-left"];
	var current = random.nextInt(0, 3);
	console.log(current);
	this.position = vectorize(pos);
	this.destination = null;
	this.velocity = 0;
	this.push = vectorize([0, 0]);
	
	var oscillate = 0.25 + (Math.random() * 0.01);
	
	var sprite = new Sprite(["center", "bottom"], {
		"ghost-left": [
			["res/img/ghost-left.png", 3]
		],
		"ghost-right": [
			["res/img/ghost-right.png", 3]
		],
		"floaty": [
			["res/img/floaty-cute-1.png", 5],
			["res/img/floaty-cute-2.png", 5],
			["res/img/floaty-cute-3.png", 5],
			["res/img/floaty-cute-2.png", 5]
		],
		"mushroom-1": [
			["res/img/mushroom-1.png", 3]
		],
		"mushroom-2": [
			["res/img/mushroom-2.png", 3]
		]
	});
	
	this.init = function() {
		this.set_state(statenames[current]);
	};
	
	this.move_to_destination = function(found_callback) {
		// do we have a destination to move to
		var towards = null;
		if (this.destination != null) {
			// get the vector pointing towards the destination
			towards = vectorize(this.destination.position.slice()).subtract(this.position);
			if (towards.abs() <= this.velocity) {
				this.position = vectorize(this.destination.position.slice());
				if (found_callback) {
					found_callback();
				}
				this.destination = null;
			} else {
				this.position.add(towards.unit().multiply(this.velocity));
			}
		}
		return towards;
	}
	
	this.seek_type = function(type) {
		var candidates = [];
		// find a thing of type specified
		for (var n=0; n<npcs.length; n++) {
			if (npcs[n].state == type) {
				candidates.push(npcs[n]);
			}
		}
		if (candidates.length) {
			this.destination = candidates[random.nextInt(0, candidates.length)];
		}
	}
	
	/*** Floaty mode ***/
	
	this.floaty_init = function(c) {
		sprite.action("floaty");
		this.velocity = 0.05;
	}
	
	this.floaty_draw = function(c) {
		world.shadow.draw(c, world.iso.w2s(this.position));
		sprite.draw(c, world.iso.w2s([this.position[0], this.position[1], 0.3 + Math.sin(gs.frameCount * oscillate) * 0.01]));
	}
	
	this.floaty_update = function(c) {
		if (!this.destination) {
			this.seek_type("mushroom");
		}
		this.move_to_destination();
		sprite.update();
		this.priority = world.iso.w2s(this.position)[1];
	}
	
	/*** Ghost mode ***/
	
	this.ghost_init = function(b) {
		sprite.action("ghost-left");
		this.velocity = 0.09;
	}
	
	this.ghost_draw = function(c) {
		world.shadow.draw(c, world.iso.w2s(this.position));
		sprite.draw(c, world.iso.w2s([this.position[0], this.position[1], 0.3 + Math.sin(gs.frameCount * oscillate) * 0.01]));
	}
	
	this.ghost_update = function(c) {
		if (!this.destination) {
			this.seek_type("floaty");
		}
		var towards = this.move_to_destination();
		if (towards) {
			towards.unit();
			var angle = Math.atan2(towards[1], towards[0]);
			var direction = "ghost-" + (angle < Math.PI * -0.25 || angle > Math.PI * 0.75 ? "left" : "right");
			sprite.action(direction);
		}
		sprite.update();
		this.priority = world.iso.w2s(this.position)[1];
	}
	
	/*** Mushroom mode ***/
	
	this.mushroom_init = function(c) {
		sprite.action("mushroom-" + (random.nextInt(0, 2) + 1));
	}
	
	this.mushroom_draw = function(c) {
		world.shadow.draw(c, world.iso.w2s(this.position));
		sprite.draw(c, world.iso.w2s(this.position));
	}
	
	this.mushroom_update = function(c) {
		sprite.update();
		this.priority = world.iso.w2s(this.position)[1];
	}
}
