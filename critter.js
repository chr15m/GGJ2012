function Critter(gs, world, pos, current, random, npcs) {
	// this critter is a statemachine
	statemachine(this);
	var statenames = ["mushroom", "floaty", "ghost"];
	var anim = ["mushroom-1", "floaty", "ghost-left"];
	this.position = vectorize(pos);
	this.destination = null;
	this.velocity = 0;
	this.push = vectorize([0, 0]);
	this.enemies = null;
	this.calculate_push = null;
	
	var oscillate = 0.25 + (Math.random() * 0.01);
	
	var sprite = new Sprite(["center", "bottom"], {
		"ghost-left": [
			["res/img/ghost-left.png", 3]
		],
		"ghost-right": [
			["res/img/ghost-right.png", 3]
		],
		"ghost-eat": [
			["res/img/ghost-eat-1.png", 5],
			["res/img/ghost-eat-2.png", 5],
			["res/img/ghost-eat-3.png", 5],
			["res/img/ghost-eat-4.png", 5]
		],
		"floaty": [
			["res/img/floaty-cute-1.png", 5],
			["res/img/floaty-cute-2.png", 5],
			["res/img/floaty-cute-3.png", 5],
			["res/img/floaty-cute-2.png", 5]
		],
		"floaty-invisible": [
			["res/img/blank.png", 5],
		],
		"mushroom-1": [
			["res/img/mushroom-1.png", 3]
		],
		"mushroom-2": [
			["res/img/mushroom-2.png", 3]
		]
	});
	this.sprite = sprite;
	
	this.init = function() {
		this.set_state(statenames[current]);
	};
	
	this.move_to_destination = function(found_callback) {
		// do we have a destination to move to
		var towards = null;
		if (this.destination != null) {
			// get the vector pointing towards the destination
			towards = vectorize(this.destination.position.slice()).subtract(this.position);
			if (this.calculate_push) {
				towards.add(this.calculate_push());
			}
			if (towards.abs() <= this.velocity) {
				this.position = vectorize(this.destination.position.slice());
				if (found_callback) {
					found_callback();
				}
			} else {
				this.position.add(towards.unit().multiply(this.velocity));
			}
		}
		return towards;
	}
	
	this.find_random_of_type = function(type) {
		var candidates = [];
		// find a thing of type specified
		for (var n=0; n<npcs.length; n++) {
			if (npcs[n].state == type) {
				candidates.push(npcs[n]);
			}
		}
		if (candidates.length) {
			return candidates[random.nextInt(0, candidates.length)];
		} else {
			return null;
		}
	}
	
	this.find_closest_of_type = function(type) {
		var closest = null;
		var closest_dist = 65536;
		for (var n=0; n<npcs.length; n++) {
			if (npcs[n].state == type) {
				var dist = vectorize(npcs[n].position.slice()).subtract(this.position).abs();
				if (dist < closest_dist) {
					closest_dist = dist;
					closest = npcs[n];
				}
			}
		}
		return closest;
	}
	
	this.seek_type = function(type) {
		this.destination = this.find_closest_of_type(type);
	}
	
	this.set_random_position = function(pos) {
		this.destination = null;
		this.position = vectorize([random.nextInt(0, world.fieldsize[0]), random.nextInt(0, world.fieldsize[1])]);
	}
	
	/*** Floaty mode ***/
	
	this.floaty_init = function(c) {
		sprite.action("floaty");
		this.velocity = 0.05;
		this.calculate_push = null;
	}
	
	this.floaty_draw = function(c) {
		world.shadow.draw(c, world.iso.w2s(this.position));
		sprite.draw(c, world.iso.w2s([this.position[0], this.position[1], 0.3 + Math.sin(gs.frameCount * oscillate) * 0.01]));
	}
	
	this.floaty_update = function(c) {
		if (!this.destination) {
			this.seek_type("mushroom");
		}
		var me = this;
		this.move_to_destination(function() {
			// me.destination.set_state("floaty");
			me.destination.set_random_position();
			// find a random ghost and turn it into a mushroom
			//me.find_random_of_type("floaty").set_state("mushroom");
			this.destination = null;
		});
		sprite.update();
		this.priority = world.iso.w2s(this.position)[1];
	}
	
	/*** Ghost mode ***/
	
	this.ghost_init = function(b) {
		sprite.action("ghost-left");
		this.velocity = 0.075;
		this.calculate_push = this.ghost_push;
	}
	
	this.ghost_draw = function(c) {
		world.shadow.draw(c, world.iso.w2s(this.position));
		sprite.draw(c, world.iso.w2s([this.position[0], this.position[1], 0.3 + Math.sin(gs.frameCount * oscillate) * 0.01]));
	}
	
	this.ghost_update = function(c) {
		if (sprite.get_action() != "ghost-eat") {
			if (towards) {
				towards.unit();
				var angle = Math.atan2(towards[1], towards[0]);
				var direction = "ghost-" + (angle < Math.PI * -0.25 || angle > Math.PI * 0.75 ? "left" : "right");
				sprite.action(direction);
			}
			if (!this.destination || this.destination.state != "floaty") {
				this.seek_type("floaty");
			}
			var me = this;
			var towards = this.move_to_destination(function() {
				// found a 'floaty' thing
				var other = me.destination;
				//other.sprite.action("floaty-invisible");
				sprite.action("ghost-eat", true, function() {
					// other.set_state("ghost");
					other.set_random_position();
					sprite.action("ghost-left");
					//me.find_random_of_type("ghost").set_state("floaty");
					me.destination = null;
				});
			});
		} else if (this.destination) {
			this.move_to_destination();
		}
		sprite.update();
		this.priority = world.iso.w2s(this.position)[1];
	}
	
	this.ghost_push = function() {
		// run away from the player
		var away = vectorize(this.position.slice()).subtract(world.player.position);
		var dist = away.abs();
		return away.unit().multiply((50 - dist) / 25);
	}
	
	/*** Mushroom mode ***/
	
	this.mushroom_init = function(c) {
		sprite.action("mushroom-" + (random.nextInt(0, 2) + 1));
		this.calculate_push = null;
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
