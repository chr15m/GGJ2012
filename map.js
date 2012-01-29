function Map(gs, world, size) {
	var seed = 18091980;
	var r = new SeedableRandom(seed);
	var tr = new SeedableRandom();
	var p = new noise.SimplexNoise(r);
	this.props = [];
	this.field = [];
	this.npcs = [];
	
	this.terraintypes = [
		"grass",
		"road",
		"sand",
		"trees",
		"water"
	];
	this.bounds = [0, 0, 0, 0];
	
	this.set_rectangle = function(rect) {
		this.bounds = rect;
	}
	
	this.init = function(rect) {
		this.props = [];
		this.field = [];
		var maketype = 0;
		for (var x = 0; x < size[0]; x++)
		{
			this.field[x] = [];
			for (var y = 0; y < size[1]; y++)		
			{
				var wx = x.mod(size[0]);
				var wy = y.mod(size[1]);
				var detail = Math.abs(p.noise(wx / 300.0, wy / 300.0));
				var desert1 = -p.noise(wx / 100.0, wy / 100.0);
				var desert2 = p.noise(wx / 10.0, wy / 10.0);
				var desertp = desert1 * detail + desert2 * (1.0 - detail);
				
				var waterp = p.noise(wx / 150.0, wy / 150.0);
				var roadsp = (Math.abs(p.noise(wx / 50.0, wy / 50.0)));
				
				var treep = Math.max(0, p.noise(wx / 150.0, wy / 150.0)) + p.noise(wx / 3.0, wy / 3.0);
				
				// water bits
				var oasis = desertp > 0.95;
				var lake = desertp < -0.6;
				var river = desert1 < 0.6 && Math.abs(waterp) < 0.075;
				// desert
				var desert = desertp > 0.6 && desertp < 1.0 || desert1 > 0.8;
				// roads
				var roads = Math.abs(roadsp) < 0.05;
				var riversideRoads = desertp < 0.6 && Math.abs(waterp) < 0.11 && Math.abs(waterp > 0.08);
				// trees
				var trees = treep > 0.9;
				
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
				
				// add a tree if this is a tree tile
				if (terrain == 3) {
					tr.seed3d(wx, wy, seed);
					this.props.push(gs.addEntity(new Tree(gs, world, tr.nextInt(0, 2) + 1, [wx + tr.next() - 0.5, wy + tr.next() - 0.5])));
				}
				
				// randomly add npcs
				tr.seed3d(wx, wy, seed);
				if (tr.next() > .99) {
					this.npcs.push(gs.addEntity(new Critter(gs, world, [wx, wy], maketype, tr, this.npcs)));
					maketype = (maketype + 1) % 3;
				}
				
				this.field[wx][wy] = terrain;
			}
		}
	}
	this.init();
	
	this.count_ghosts = function() {
		var num_ghosts = 0;
		for (var n=0; n<this.npcs.length; n++) {
			if (this.npcs[n].state == "ghost") {
				num_ghosts++;
			}
		}
		return num_ghosts;
	}
	
	this.get_tile = function(x, y) {
		return this.terraintypes[this.field[x.mod(size[0])][y.mod(size[1])]];
	}
}
