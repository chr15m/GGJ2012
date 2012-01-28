function Map(gs, world) {
	var seed = 18091980;
	var r = new SeedableRandom(seed);
	var tr = new SeedableRandom();
	var p = new noise.SimplexNoise(r);
	this.trees = [];
	
	this.field = [];
	this.terraintypes = [
		"grass",
		"road",
		"sand",
		"trees",
		"water"
	];
	this.bounds = [0, 0, 0, 0];
	
	this.set_rectangle = function(rect) {
		for (var t=0; t<this.trees.length; t++) {
			gs.delEntity(this.trees[t]);
		}
		this.trees = [];
		this.field = [];
		this.bounds = rect;
		for (var x = rect[0]; x < rect[0] + rect[2]; x++)
		{
			this.field[x - rect[0]] = [];
			for (var y = rect[1]; y < rect[1] + rect[3]; y++)		
			{
				var detail = Math.abs(p.noise(x / 300.0, y / 300.0))
				var desert1 = -p.noise(x / 100.0, y / 100.0)
				var desert2 = p.noise(x / 10.0, y / 10.0)
				var desertp = desert1 * detail + desert2 * (1.0 - detail)
				
				var waterp = p.noise(x / 150.0, y / 150.0)
				var roadsp = (Math.abs(p.noise(x / 50.0, y / 50.0)))
				
				var treep = Math.max(0, p.noise(x / 50.0, y / 50.0)) + p.noise(x / 3.0, y / 3.0)
				
				// water bits
				var oasis = desertp > 0.95
				var lake = desertp < -0.6
				var river = desert1 < 0.6 && Math.abs(waterp) < 0.075
				// desert
				var desert = desertp > 0.6 && desertp < 1.0 || desert1 > 0.8
				// roads
				var roads = Math.abs(roadsp) < 0.05
				var riversideRoads = desertp < 0.6 && Math.abs(waterp) < 0.11 && Math.abs(waterp > 0.08)
				// trees
				var trees = treep > 0.75
				
				if (lake || river || oasis) {
					terrain = 4;
				} else if (roads || riversideRoads) {
					terrain = 1;
				} else if (desert) {
					terrain = 2;
				} else if (trees) {
					terrain = 3;
					tr.seed3d(x, y, seed);
					this.trees.push(gs.addEntity(new Tree(gs, world, 1, [x + tr.next() - 0.5, y + tr.next() - 0.5])));
				} else {
					terrain = 0;
				}
				this.field[x - rect[0]][y - rect[1]] = terrain;
			}
		}
	}
	
	this.get_tile = function(x, y) {
		return this.terraintypes[this.field[x - this.bounds[0]][y - this.bounds[1]]];
	}
}
