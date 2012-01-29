function Tree(gs, world, treenum, position) {
	this.priority = world.iso.w2s(position)[1];
	var sprite = (new Sprite(["center", "bottom"], {"default": [["res/img/tree-" + treenum + ".png", 1]]})).action("default");
	
	this.draw = function(c) {
		world.shadow.draw(c, world.iso.w2s(position));
		sprite.draw(c, world.iso.w2s(position));
	}
}
