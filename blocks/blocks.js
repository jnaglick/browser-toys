var BlockMaker = (function() {
	var
		TOP = 0, LEFT = 0, //cardinal spot in browser where (0, 0, 0) is defined
		BLOCK_H = 30, BLOCK_W = 30, BLOCK_D = 14, //block sizes: height, width, depth
		BLOCK_O = 0.1 //opacity of blocks
	;
	
	function xyz2tl(x, y, z) { //(x, y, z) coordinates to (top, left) values - based on block size.
		return {t : TOP + (y * BLOCK_D) - (z * BLOCK_H), l : LEFT + (y * BLOCK_D) + (x * BLOCK_W)};
	}
		
	function initBlock(x, y, z, color) {
		var s = document.createElement("span");
		s.id = x + "." + y + "." + z;

		var b = document.createElement("span");
		b.style.position = "absolute";
		b.style.top = xyz2tl(x,y,z).t + "px";
		b.style.left = xyz2tl(x,y,z).l + "px";
		b.style.height = BLOCK_H + "px";
		b.style.width = BLOCK_W + "px";
		b.style.opacity = BLOCK_O;// - (BLOCK_O/BLOCK_D * 0.36 * y);
		b.style.background = color;

		document.body.appendChild(s);
		s.appendChild(b);
		
		return s;
	}
	
	return {
		addBlock: function(x, y, z, color) {			
			var s = initBlock(x, y, z, color);
			var b = s.firstChild;
			var top = xyz2tl(x,y,z).t, left =xyz2tl(x,y,z).l;
			for (var i = 0; i < BLOCK_D-1; i++) {
				var newB = b.cloneNode(true);
				newB.style.top = ++top + "px";
				newB.style.left = ++left + "px";
				s.appendChild(newB);
				b = newB;
			}
			return s;
		},
		
		removeBlock: function(x, y, z) {
			var e = document.getElementById(x + "." + y + "." + z)
			if (e) {
				document.body.removeChild(e);
			}
		}
	};
})();

var Demo = (function() {
	var Cursor = (function() {
		var x = 0, y = 0, z = 0,
			r = 100, g = 20, b = 100,
			cursorBlock;

		function rgb2hex(r, g, b) { //(r, g, b) {range: 0 - 255} decimal values to HTML rgb hex string
			var v = Number((r * 65536) + (g * 256) + b).toString(16);
			return "#" + ("000000".substr(0, 6 - v.length) + v);
		}

		return {
			x: function() {return x;},
			y: function() {return y;},
			z: function() {return z;},
			r: function() {return r;},
			g: function() {return g;},
			b: function() {return b;},
			
			up: 		function() {z++;},
			down: 		function() {z--;},
			left: 		function() {x--;},
			right: 		function() {x++;},
			forward: 	function() {y++;},
			back: 		function() {y--;},
			
			ri: function() {r++;},
			rd: function() {r--;},
			gi: function() {g++;},
			gd: function() {g--;},
			bi: function() {b++;},
			bd: function() {b--;},		
			
			update: function() {
				if (cursorBlock) {
					document.body.removeChild(cursorBlock);
				}
				cursorBlock = BlockMaker.addBlock(x, y, z, rgb2hex(r,g,b));
				cursorBlock.id = "cursor";
			},
			
			place: function() {
				BlockMaker.addBlock(x, y, z, rgb2hex(r,g,b));
			},
			
			erase: function() {
				BlockMaker.removeBlock(x, y, z);
			}
		};
	})();

	function update() {
		Cursor.update();
		
		document.getElementById("blockdemo-status").innerHTML = 
			"Coords: "  + Cursor.x() + "," + Cursor.y() + "," + Cursor.z() +
			"<br/>" +
			"RGB: " + Cursor.r() + "," + Cursor.g() + "," + Cursor.b();		
	}
	
	function handleKeyPress(event) {
		var c = String.fromCharCode(event.which);
		
		if (c == 'w') Cursor.back(); 
		else if (c == 's') Cursor.forward();
		else if (c == 'd') Cursor.right();
		else if (c == 'a') Cursor.left();
		else if (c == 'q') Cursor.down();
		else if (c == 'e') Cursor.up();
		
		else if (c == 't') Cursor.ri();
		else if (c == 'y') Cursor.gi();
		else if (c == 'u') Cursor.bi();
		else if (c == 'g') Cursor.rd();
		else if (c == 'h') Cursor.gd();
		else if (c == 'j') Cursor.bd();
		
		else if (c == 'k') Cursor.place();
		else if (c == 'm') Cursor.erase();
		
		update();
	}

	return {
		ready: function() {
			$('body').append('<span id="blockdemo-status"></span>');
			$(document).keypress(handleKeyPress);
			update();
		}
	};
})();