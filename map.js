function Map(gs, world, size) {
	var seed = 18091980;
	var r = new SeedableRandom(seed);
	var tr = new SeedableRandom();
	var p = new noise.SimplexNoise(r);
	cache = [];
	for (var x=0; x<size[0]; x++) {
		for (var y=0; y<size[1]; y++) {
			if (cache[x] == null) {
				cache[x] = [];
			}
			cache[x][y] = null;
		}
	}
	this.props = [];
	
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
		for (var t=0; t<this.props.length; t++) {
			gs.delEntity(this.props[t]);
		}
		this.props = [];
		this.field = [];
		this.bounds = rect;
		for (var x = rect[0]; x < rect[0] + rect[2]; x++)
		{
			this.field[x.mod(size[0]) - rect[0]] = [];
			for (var y = rect[1]; y < rect[1] + rect[3]; y++)		
			{
				var wx = x.mod(size[0]);
				var wy = y.mod(size[1]);
				// see if this previously fetched tile is in the cache
				if (cache[wx][wy] != null) {
					terrain = cache[wx][wy];
				} else {
					var detail = Math.abs(p.noise(wx / 300.0, wy / 300.0))
					var desert1 = -p.noise(wx / 100.0, wy / 100.0)
					var desert2 = p.noise(wx / 10.0, wy / 10.0)
					var desertp = desert1 * detail + desert2 * (1.0 - detail)
					
					var waterp = p.noise(wx / 150.0, wy / 150.0)
					var roadsp = (Math.abs(p.noise(wx / 50.0, wy / 50.0)))
					
					var treep = Math.max(0, p.noise(wx / 50.0, wy / 50.0)) + p.noise(wx / 3.0, wy / 3.0)
					
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
					} else {
						terrain = 0;
					}
					cache[wx][wy] = terrain;
				}
				
				// add a tree if this is a tree tile
				if (terrain == 3) {
					tr.seed3d(wx, wy, seed);
					this.props.push(gs.addEntity(new Tree(gs, world, 1, [wx + tr.next() - 0.5, wy + tr.next() - 0.5])));
				}
				
				// randomly add little circles
				
				this.field[wx - rect[0]][wy - rect[1]] = terrain;
			}
		}
	}
	
	this.get_tile = function(x, y) {
		return this.terraintypes[this.field[x.mod(size[0]) - this.bounds[0]][y.mod(size[1]) - this.bounds[1]]];
	}
}
