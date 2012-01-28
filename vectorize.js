/** Gives any array vector methods, which are all in-place. */
function vectorize(x) {
	// this is what sylvester uses
	var precision = 1e-6;
	
	x.equals = function(b) {
		var equal = true;
		if (this.length != b.length) {
			equal = false;
		} else {
			for (var i=0; i<this.length; i++) {
				if (Math.abs(this[i] - b[i]) > precision) {
					equal = false;
				}
			}
		}
		return equal;
	}
	
	x.add = function(b) {
		for (var i=0; i<this.length; i++) {
			this[i] += b[i];
		}
		return this;
	}
	
	x.subtract = function(b) {
		for (var i=0; i<this.length; i++) {
			this[i] -= b[i];
		}
		return this;
	}
	
	x.unit = function(b) {
		return this.divide(this.abs());
	}
	
	x.abs = function() {
		var total = 0;
		for (var i=0; i<this.length; i++) {
			total += this[i]*this[i];
		}
		return Math.sqrt(total);
	}
	
	x.multiply = function(b) {
		if (typeof(b) == typeof(1)) {
			for (var i=0; i<this.length; i++) {
				this[i] *= b;
			}
		}
		return this;
	}
	
	x.divide = function(b) {
		if (typeof(b) == typeof(1)) {
			for (var i=0; i<this.length; i++) {
				this[i] /= b;
			}
		}
		return this;
	}
	
	return x;
}

/* test cases:

	EQUALS
>>> vectorize([2, 3, 5]).equals(vectorize([2, 4, 5]));
false
>>> vectorize([2, 3, 5]).equals(vectorize([2, 3, 5]));
true
>>> vectorize([2, 3, 5]).equals(vectorize([2, 3]));
false
>>> vectorize([2, 3, 5]).equals(vectorize([2, 4]));
false
>>> vectorize([2, 3, 5]).equals(vectorize([2, 3, 5]));
true
>>> vectorize([2, 3, 5]).equals(vectorize([2, 3.001, 5]));
false
>>> vectorize([2, 3, 5]).equals(vectorize([2, 3.000001, 5]));
false
>>> vectorize([2, 3, 5]).equals(vectorize([2, 3.000000001, 5]));
true


	ABS / MAGNITUDE
>>> vectorize([1,1]).abs();
1.4142135623730951
>>> vectorize([1,0]).abs();
1
>>> vectorize([0,1]).abs();
1
>>> vectorize([0,1,0]).abs();
1
>>> vectorize([0,1,1]).abs();
1.4142135623730951
>>> vectorize([1,1,1]).abs();
1.7320508075688772
>>> vectorize([1,1,1,1]).abs();
2
>>> vectorize([1,1,1,1]).abs();
2
>>> vectorize([1,2]).abs();
2.23606797749979


	VECTOR ADDITION
>>> vectorize([1, 2, 3]).add([2, 2, 3]);
[3, 4, 6]


	UNIT VECTOR
>>> vectorize([1, 2, 1]).unit();
[0.4082482904638631, 0.8164965809277261, 0.4082482904638631]
>>> vectorize([1, 2, 1]).abs();
2.449489742783178
>>> vectorize([2, 2, 2, 2]).abs();
4
>>> vectorize([2, 2, 2, 2]).unit();
[0.5, 0.5, 0.5, 0.5]
>>> vectorize([1, 1, 1, 1]).abs();
2
*/
