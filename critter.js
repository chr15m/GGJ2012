function Critter(gs, world, pos, random) {
	// this critter is a statemachine
	statemachine(this);
	var statenames = ["mushroom", "floaty", "ghost"];
	var anim = ["mushroom-1", "floaty", "ghost-left"];
	var current = random.nextInt(0, 3);
	this.position = vectorize(pos);
	this.destination = vectorize(this.position);
	
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
		this.set_state("mushroom");
	};
	
	/*** Floaty mode ***/
	
	this.floaty_init = function(c) {
		sprite.action("floaty");
	}
	
	this.floaty_draw = function(c) {
		world.shadow.draw(c, world.iso.w2s(this.position));
		sprite.draw(c, world.iso.w2s([this.position[0], this.position[1], 0.3 + Math.sin(gs.frameCount * oscillate) * 0.01]));
	}
	
	this.floaty_update = function(c) {
		sprite.update();
		this.priority = world.iso.w2s(this.position)[1];
	}
	
	/*** Ghost mode ***/
	
	this.ghost_init = function(b) {
		sprite.action("ghost-left");
	}
	
	this.ghost_draw = function(c) {
		world.shadow.draw(c, world.iso.w2s(this.position));
		sprite.draw(c, world.iso.w2s([this.position[0], this.position[1], 0.3 + Math.sin(gs.frameCount * oscillate) * 0.01]));
	}
	
	this.ghost_update = function(c) {
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
