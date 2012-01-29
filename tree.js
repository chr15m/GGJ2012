function Tree(gs, world, treenum, position) {
	var sprite = (new Sprite(["center", "bottom"], {"default": [["res/img/tree-" + treenum + ".png", 1]]})).action("default");
	
	this.update = function(c) {
		this.priority = world.iso.w2s(position)[1];
	}
	
	this.draw = function(c) {
		var spos = world.iso.w2s(position);
		if (spos[0] >= -sprite.width && spos[1] >= -sprite.height && spos[0] < gs.width + sprite.width && spos[1] < gs.height + sprite.height) {
			world.shadow.draw(c, spos);
			sprite.draw(c, spos);
		}
	}
}
