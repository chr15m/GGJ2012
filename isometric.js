Isometric = function(tilesize, skew) {
	var tilesize = tilesize ? tilesize : 64;
	var skew = skew ? skew : 0.5;
	
	/** Translate screen/pixel coordinates into isometric (ground) coordinates. */
	this.screen_to_world = function(x, y) {
		
	}
	/** Alias for screen_to_world. */
	this.s2w = this.screen_to_world;
	
	/** Translate isometric world coordinates into screen coordinates. */
	this.world_to_screen = function(x, y, z) {
		// default to 0 if z is not supplied
		var z = z == null ? 0 : z;
		return [(x + y) * tilesize, ((x - y) * skew - z) * tilesize];
	}
	/** Alias for world_to_screen. */
	this.w2s = this.world_to_screen;	
}
